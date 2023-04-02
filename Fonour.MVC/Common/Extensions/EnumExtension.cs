using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Fonour.MVC.Common.Extensions
{
    public static class EnumExtension
    {
        /// <summary>
        /// 擴展方法，獲得枚舉的Description
        /// </summary>
        /// <param name="value">枚舉值</param>
        /// <param name="nameInstead">當枚舉值沒有定義DescriptionAttribute，是否使用枚舉名代替，默認是使用</param>
        /// <returns>枚舉的Description</returns>
        public static string GetDescription(this Enum value, bool nameInstead = true)
        {
            var type = value.GetType();
            var name = Enum.GetName(type, value);
            if (name == null)
            {
                return null;
            }

            var field = type.GetField(name);
            var attribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute;
            if (attribute == null && nameInstead)
            {
                return name;
            }

            return attribute?.Description;
        }

        /// <summary>
        /// 把枚舉轉換為鍵值對集合
        /// </summary>
        /// <param name="enumType">枚舉類型</param>
        /// <param name="getText">以Enum為參數類型，String為返回類型的委托</param>
        /// <returns>以枚舉值為key，枚舉文本為value的鍵值對集合</returns>
        public static Dictionary<long, string> EnumToDictionary(this Type enumType, Func<Enum, string> getText)
        {
            if (!enumType.IsEnum)
            {
                throw new ArgumentException("傳入的參數必須是枚舉類型！", nameof(enumType));
            }

            var enumDic = new Dictionary<long, string>();
            var enumValues = Enum.GetValues(enumType);
            foreach (Enum enumValue in enumValues)
            {
                var key = Convert.ToInt64(enumValue);
                var value = getText(enumValue);
                enumDic.Add(key, value);
            }

            return enumDic;
        }
    }
}