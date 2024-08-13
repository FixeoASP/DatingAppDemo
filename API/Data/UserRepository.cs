﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, UserManager<AppUser> userManager, IMapper mapper)
    {
        _context = context;
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<MemberDto> GetMemberAsync(string username)
    {
        return await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var userQuery = _context.Users.AsQueryable();

        userQuery = userQuery.Where(u => u.UserName != userParams.CurrentUserName);
        userQuery = userQuery.Where(u => u.Gender == userParams.Gender);

        var minDoB = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDoB = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
        userQuery = userQuery.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
        userQuery = userParams.OrderBy switch
        {
            "created" => userQuery.OrderByDescending(u => u.Created),
            _ => userQuery.OrderByDescending(u => u.LastActive)
        };

        var query = userQuery.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .AsNoTracking();
        return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
    }

    public async Task<AppUser> GetUserById(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _userManager.Users
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users
            .Include(x => x.Photos)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;

    }
}
