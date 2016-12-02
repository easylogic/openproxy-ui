/*
 * Created by SharpDevelop.
 * User: Jayden
 * Date: 2016-12-02
 * Time: 오후 2:11
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;

namespace WindowProxyManager
{
	class Program
	{
		public static void Main(string[] args)
		{
			if (args.Length == 0) {
				return; 
			}
			
			ProxyManager manager = new ProxyManager();
			
			if (args[0] == "stop") {
				manager.Stop();				
			} else if (args[0] == "start") {
				
				for(int i = 1; i < args.Length; i ++) {
					manager.Add(args[i]);
				}
				
				manager.Run();
			}

		}
	}
}