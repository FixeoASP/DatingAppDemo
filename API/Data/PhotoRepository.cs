using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Photo?> GetPhotoById(int id)
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
        }

        // public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos(UserParams userParams)
        public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .Where(p => !p.IsApproved)
                .Select(p => new PhotoForApprovalDto
                {
                    Id = p.Id,
                    Username = p.AppUser.UserName!,
                    Url = p.Url,
                    IsApproved = p.IsApproved
                })
                .ToListAsync();
            // return await PagedList<PhotoForApprovalDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public void RemovePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }
    }
}
