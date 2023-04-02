using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Fonour.Domain.Entities;
using Fonour.MVC.Common.Extensions;

namespace Fonour.MVC.Controllers
{
    public abstract class FonourControllerBase : Controller
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var user = filterContext.HttpContext.Session.Get<User>("CurrentUser");
            if (user == null)
            {
                filterContext.Result = new RedirectResult("/Login/Index");
                return;
            }
            base.OnActionExecuting(filterContext);
        }

        /// <summary>
        /// 獲取服務端驗證的第一條錯誤信息
        /// </summary>
        /// <returns></returns>
        public string GetModelStateError()
        {
            foreach (var item in ModelState.Values)
            {
                if (item.Errors.Count > 0)
                {
                    return item.Errors[0].ErrorMessage;
                }
            }
            return "";
        }
    }
}
