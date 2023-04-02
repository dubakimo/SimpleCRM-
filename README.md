# Asp.Net Core 權限管理系統
> Sql Server 版本不得低於 2012，否則會出現分頁方法出錯

## Code First 操作步驟,首先設定啟動專案
* 使用程序包管理器控制台(前提安裝 Microsoft.EntityFrameworkCore、Microsoft.EntityFrameworkCore.Tools )
  * `Add-Migration Init`
  * `Update-DataBase`
  * `Remove-Migration `
* 使用 .NET Core CLI 命令
  * `dotnet ef migrations add init`
  * `dotnet ef database update`*
#任何問題歡迎聯繫line: @okw9958o ,微信: dubakimo

