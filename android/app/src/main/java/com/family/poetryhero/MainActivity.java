package com.family.poetryhero;

import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private static final String APP_ORIGIN = "https://localhost";
  private String appHome = APP_ORIGIN + "/";

  @Override
  public void onResume() {
    super.onResume();
    rememberAppHome();
  }

  @Override
  public void onStart() {
    super.onStart();
    rememberAppHome();
  }

  // 记录应用自身首页，用于被外部页面顶掉后一键返回
  private void rememberAppHome() {
    WebView wv = bridge == null ? null : bridge.getWebView();
    if (wv == null) return;
    String u = wv.getUrl();
    if (u != null && u.startsWith(APP_ORIGIN)) appHome = u;
  }

  @Override
  public void onBackPressed() {
    WebView wv = bridge == null ? null : bridge.getWebView();
    String url = wv == null ? null : wv.getUrl();
    if (url != null && !url.startsWith(APP_ORIGIN)) {
      // WebView 被外部页面顶掉：返回键直接回到应用内
      wv.loadUrl(appHome);
      return;
    }
    super.onBackPressed();
  }
}
