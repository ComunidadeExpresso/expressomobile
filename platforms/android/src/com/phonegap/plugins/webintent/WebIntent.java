package com.phonegap.plugins.webintent;

import com.celepar.expresso.MainActivity;

import com.udinic.accounts_authenticator_example.authentication.AccountGeneral;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;
import android.text.Html;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

/**
 * WebIntent is a PhoneGap plugin that bridges Android intents and web
 * applications:
 * 
 * 1. web apps can spawn intents that call native Android applications. 2.
 * (after setting up correct intent filters for PhoneGap applications), Android
 * intents can be handled by PhoneGap web applications.
 * 
 * @author boris@borismus.com
 * 
 */
public class WebIntent extends CordovaPlugin {

	private CallbackContext callbackContext = null;

	private CallbackContext onNewIntentCallbackContext = null;
	
	private AccountManager mAccountManager;

	@SuppressWarnings("deprecation")
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
	    try {
	        this.callbackContext = callbackContext;

	        if (action.equals("startActivity")) {
	            if (args.length() != 1) {
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	                return false;
	            }

	            // Parse the arguments
	            JSONObject obj = args.getJSONObject(0);
	            String type = obj.has("type") ? obj.getString("type") : null;
	            Uri uri = obj.has("url") ? Uri.parse(obj.getString("url")) : null;
	            JSONObject extras = obj.has("extras") ? obj.getJSONObject("extras") : null;
	            Map<String, String> extrasMap = new HashMap<String, String>();

	            // Populate the extras if any exist
	            if (extras != null) {
	                JSONArray extraNames = extras.names();
	                for (int i = 0; i < extraNames.length(); i++) {
	                    String key = extraNames.getString(i);
	                    String value = extras.getString(key);
	                    extrasMap.put(key, value);
	                }
	            }

	            startActivity(obj.getString("action"), uri, type, extrasMap);
	            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
	            return true;
	            
	        }  else if (action.equals("hasExtra")) {
	            if (args.length() != 1) {
	                //return new PluginResult(PluginResult.Status.INVALID_ACTION);
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	                return false;
	            }
	            Intent i = ((CordovaActivity)this.cordova.getActivity()).getIntent();
	            String extraName = args.getString(0);
	            //return new PluginResult(PluginResult.Status.OK, i.hasExtra(extraName));
	            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, i.hasExtra(extraName)));
	            return true;
	            
	        } else if (action.equals("clearCookies")) {
	        	
	        	Log.v("ClearCookies","Clear Cookies");
	        	
	        	MainActivity act = (MainActivity)this.cordova.getActivity();
	        	act.clearCookies();
	        	
//	        	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, ""));
	        	
	        } else if (action.equals("getExtra")) {
	            if (args.length() != 1) {
	                //return new PluginResult(PluginResult.Status.INVALID_ACTION);
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	                return false;
	            }
	            Intent i = ((CordovaActivity)this.cordova.getActivity()).getIntent();
	            
	            Log.v("Intent", i.getAction());
	            
	            String extraName = args.getString(0);
	            
	            StringBuilder str = new StringBuilder();
	            Bundle bundle = i.getExtras();
	            if (bundle != null) {
	                Set<String> keys = bundle.keySet();
	                Iterator<String> it = keys.iterator();
	                while (it.hasNext()) {
	                    String key = it.next();
	                    
	                    if (key.equals(extraName)) {
	                    	str.append(bundle.get(key));
	                    	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, str.toString()));
	    	                return true;
	                    }
//	                    str.append(key);
//	                    str.append(":");
//	                    str.append(bundle.get(key));
//	                    str.append("\n\r");
	                }
	                //Log.v("Intent", str.toString());
	            }
	            	            
	            if ( i.hasExtra(extraName)) {
	            	
	            	
	                
	            } else {
	                //return new PluginResult(PluginResult.Status.ERROR);
	             //   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
	              //  return false;
	            }
	        } else if (action.equals("getUri")) {
	            if (args.length() != 0) {
	                //return new PluginResult(PluginResult.Status.INVALID_ACTION);
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	                return false;
	            }

	            Intent i = ((CordovaActivity)this.cordova.getActivity()).getIntent();
	            String uri = i.getDataString();
	            //return new PluginResult(PluginResult.Status.OK, uri);
	            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, uri));
	            return true;
	        } else if (action.equals("onNewIntent")) {

	        	this.onNewIntentCallbackContext = callbackContext;
        
                if (args.length() != 0) {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
                    return false;
                }
                
                PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true); //re-use the callback on intent events
                callbackContext.sendPluginResult(result);
                return true;


	        } else if (action.equals("sendBroadcast")) 
	        {
	            if (args.length() != 1) {
	                //return new PluginResult(PluginResult.Status.INVALID_ACTION);
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	                return false;
	            }

	            // Parse the arguments
	            JSONObject obj = args.getJSONObject(0);

	            JSONObject extras = obj.has("extras") ? obj.getJSONObject("extras") : null;
	            Map<String, String> extrasMap = new HashMap<String, String>();

	            // Populate the extras if any exist
	            if (extras != null) {
	                JSONArray extraNames = extras.names();
	                for (int i = 0; i < extraNames.length(); i++) {
	                    String key = extraNames.getString(i);
	                    String value = extras.getString(key);
	                    extrasMap.put(key, value);
	                }
	            }

	            sendBroadcast(obj.getString("action"), extrasMap);
	            //return new PluginResult(PluginResult.Status.OK);
	            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
	            return true;
	        }
	        //return new PluginResult(PluginResult.Status.INVALID_ACTION);
	        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	        return false;
	    } catch (JSONException e) {
	        e.printStackTrace();
	        //return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
	        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
	        return false;
	    }
	}

	@Override
	public void onNewIntent(Intent intent) {

		if (this.onNewIntentCallbackContext != null) {

            String route = intent.getStringExtra("ROUTE");
        	PluginResult result = new PluginResult(PluginResult.Status.OK, route);
        	result.setKeepCallback(true);
            this.onNewIntentCallbackContext.sendPluginResult(result);
        }

	}

    void startActivity(String action, Uri uri, String type, Map<String, String> extras) {
        Intent i = (uri != null ? new Intent(action, uri) : new Intent(action));
        
        if (type != null && uri != null) {
            i.setDataAndType(uri, type); //Fix the crash problem with android 2.3.6
        } else {
            if (type != null) {
                i.setType(type);
            }
        }
        
        for (String key : extras.keySet()) {
            String value = extras.get(key);
            // If type is text html, the extra text must sent as HTML
            if (key.equals(Intent.EXTRA_TEXT) && type.equals("text/html")) {
                i.putExtra(key, Html.fromHtml(value));
            } else if (key.equals(Intent.EXTRA_STREAM)) {
                // allowes sharing of images as attachments.
                // value in this case should be a URI of a file
                i.putExtra(key, Uri.parse(value));
            } else if (key.equals(Intent.EXTRA_EMAIL)) {
                // allows to add the email address of the receiver
                i.putExtra(Intent.EXTRA_EMAIL, new String[] { value });
            } else {
                i.putExtra(key, value);
            }
        }
        ((CordovaActivity)this.cordova.getActivity()).startActivity(i);
    }

    void sendBroadcast(String action, Map<String, String> extras) {
        Intent intent = new Intent();
        intent.setAction(action);
        for (String key : extras.keySet()) {
            String value = extras.get(key);
            intent.putExtra(key, value);
        }

        ((CordovaActivity)this.cordova.getActivity()).sendBroadcast(intent);
    }

}