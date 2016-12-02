/*
 * Created by SharpDevelop.
 * User: Jayden
 * Date: 2016-12-02
 * Time: 오후 2:12
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace WindowProxyManager
{
	/// <summary>
	/// Description of ProxyManager.
	/// </summary>
	public class ProxyManager {
    [DllImport("wininet.dll", SetLastError = true)]
    private static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lPBuffer, int lpdwBufferLength);

    private const int INTERNET_OPTION_REFRESH = 0x000025;
    private const int INTERNET_OPTION_SETTINGS_CHANGED = 0x000027;
    private const string regeditKey = "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

    private List<string> proxyLibs = new List<string>();
    private void Reflush() {
        InternetSetOption(IntPtr.Zero, INTERNET_OPTION_SETTINGS_CHANGED, IntPtr.Zero, 0);
        InternetSetOption(IntPtr.Zero, INTERNET_OPTION_REFRESH, IntPtr.Zero, 0);
    }

    public void Add(string server) {
        this.proxyLibs.Add(server);
    }

    public void Run() {
        RegistryKey key = Registry.CurrentUser.OpenSubKey(regeditKey, true);
        key.SetValue("ProxyServer", String.Join(";", this.proxyLibs.ToArray()));
        key.SetValue("ProxyEnable", 1);
        key.Close();
        this.Reflush();
    }

    public void Stop() {
        RegistryKey key = Registry.CurrentUser.OpenSubKey(regeditKey, true);
        key.SetValue("ProxyEnable", 0);
        key.Close();
        this.Reflush();
    }
}
}
