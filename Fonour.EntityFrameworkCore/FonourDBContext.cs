﻿using System;
using System.Collections.Generic;
using System.Text;
using Fonour.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Fonour.EntityFrameworkCore
{
    public class FonourDbContext : DbContext
    {
        public FonourDbContext(DbContextOptions<FonourDbContext> options) 
            : base(options)
        {

        }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            //UserRole关联配置
            builder.Entity<UserRole>()
              .HasKey(ur => new { ur.UserId, ur.RoleId });

            //RoleMenu关联配置
            builder.Entity<RoleMenu>()
              .HasKey(rm => new { rm.RoleId, rm.MenuId });

            base.OnModelCreating(builder);
        }
    }
}
