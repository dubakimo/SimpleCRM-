using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Fonour.MVC.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "用戶名不能為空。")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "密碼不能為空。")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
