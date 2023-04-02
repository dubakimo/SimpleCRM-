using Fonour.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Fonour.EntityFrameworkCore
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.CreateScope()) //手動高亮
            {
                using (var context = serviceScope.ServiceProvider.GetService<FonourDbContext>()) //手動高亮
                {
                    Guid departmentId = Guid.NewGuid();

                    //增加一個部門
                    if (!context.Departments.Any())
                    {
                        context.Departments.Add(
                            new Department
                            {
                                Id = departmentId,
                                Name = "華新麗華集團總部",
                                ParentId = Guid.Empty
                            }
                         );
                    }

                    //增加一個超級管理員用戶
                    if (!context.Users.Any())
                    {
                        context.Users.Add(
                             new User
                             {
                                 UserName = "admin",
                                 Password = "123456", //暫不進行加密
                                 Name = "超級管理員",
                                 DepartmentId = departmentId
                             }
                        );
                    }

                    //增加四個基本功能菜單
                    if (!context.Menus.Any())
                    {
                        context.Menus.AddRange(
                          new Menu
                          {
                              Name = "組織機構管理",
                              Code = "Department",
                              SerialNumber = 0,
                              ParentId = Guid.Empty,
                              Url = "/Department/Index",
                              Icon = "fa fa-link"
                          },
                          new Menu
                          {
                              Name = "角色管理",
                              Code = "Role",
                              SerialNumber = 1,
                              ParentId = Guid.Empty,
                              Url = "/Role/Index",
                              Icon = "fa fa-link"
                          },
                          new Menu
                          {
                              Name = "用戶管理",
                              Code = "User",
                              SerialNumber = 2,
                              ParentId = Guid.Empty,
                              Url = "/User/Index",
                              Icon = "fa fa-link"
                          },
                          new Menu
                          {
                              Name = "功能管理",
                              Code = "Menu",
                              SerialNumber = 3,
                              ParentId = Guid.Empty,
                              Url = "/Menu/Index",
                              Icon = "fa fa-link"
                          }
                       );
                    }

                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
