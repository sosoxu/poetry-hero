package com.family.poetryhero;

import android.content.Intent;
import android.net.Uri;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * 拉起外部App（B站/抖音等）：已安装则打开App，未安装则回退到系统浏览器打开网页。
 * 全程由原生 startActivity 完成，WebView 不发生任何导航，杜绝“浏览器顶掉应用”。
 */
@CapacitorPlugin(name = "AppLauncher")
public class AppLauncherPlugin extends Plugin {

    @PluginMethod
    public void open(PluginCall call) {
        String uri = call.getString("uri");           // intent:// 或自定义scheme的URI
        String fallbackUrl = call.getString("fallbackUrl"); // 未安装App时的https回退
        if (uri == null) {
            call.reject("uri required");
            return;
        }
        try {
            Intent intent = Intent.parseUri(uri, Intent.URI_INTENT_SCHEME);
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            bridge.getActivity().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("opened", "app");
            call.resolve(ret);
        } catch (Exception notInstalled) {
            // App未安装：回退浏览器打开
            if (fallbackUrl != null) {
                try {
                    Intent b = new Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl));
                    b.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    bridge.getActivity().startActivity(b);
                    JSObject ret = new JSObject();
                    ret.put("opened", "browser");
                    call.resolve(ret);
                } catch (Exception e2) {
                    call.reject("no handler");
                }
            } else {
                call.reject("app not installed");
            }
        }
    }
}
