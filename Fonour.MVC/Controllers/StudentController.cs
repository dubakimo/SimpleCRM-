using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fonour.MVC.Controllers
{
    [Route("api/student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        // <summary>
        /// 取得所有學生
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public string Get()
        {
            return "Tom";
        }

        /// <summary>
        /// 新增學生
        /// </summary>
        [HttpPost]
        public void Post()
        {

        }


        /// <summary>
        /// 修改學生訊息
        /// </summary>
        [HttpPut]
        public void Put()
        {

        }

        /// <summary>
        /// 刪除學生訊息
        /// </summary>
        [HttpDelete]
        public void Delete()
        {

        }
    }
}
