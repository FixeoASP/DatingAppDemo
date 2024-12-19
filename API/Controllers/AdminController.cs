using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _uow;
        private readonly IPhotoService _photoService;

        public AdminController(UserManager<AppUser> userManager, IUnitOfWork uow, IPhotoService photoService)
        {
            _userManager = userManager;
            _uow = uow;
            _photoService = photoService;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();
            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

            var selectedRoles = roles.Split(',').ToArray();// Mem, Mod

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound();

            var userRoles = await _userManager.GetRolesAsync(user); // Mem

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles)); // Mod

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPut("approve-photo/{photoId}")]
        public async Task<ActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _uow.PhotoRepository.GetPhotoById(photoId);

            if (photo == null) return NotFound();

            photo.IsApproved = true;

            var user = await _uow.UserRepository.GetUserByPhotoId(photoId);

            if (user == null) return BadRequest("Could not get user from db");

            if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

            if (!await _uow.Complete()) return BadRequest("Failed to approve photo");

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{photoId}")]
        public async Task<ActionResult> RejectPhoto(int photoId)
        {
            var photo = await _uow.PhotoRepository.GetPhotoById(photoId);

            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Result == "ok")
                {
                    _uow.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                _uow.PhotoRepository.RemovePhoto(photo);
            }

            if (!await _uow.Complete()) return BadRequest("Failed to reject photo");

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await _uow.PhotoRepository.GetUnapprovedPhotos();
            return Ok(photos);
        }
    }
}
