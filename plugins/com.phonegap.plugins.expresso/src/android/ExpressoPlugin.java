package com.phonegap.plugins.expresso;

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
 * ExpressoPlugin is a PhoneGap plugin that bridges Android intents and web
 * applications:
 * 
 * 1. web apps can spawn intents that call native Android applications. 2.
 * (after setting up correct intent filters for PhoneGap applications), Android
 * intents can be handled by PhoneGap web applications.
 * 
 * @author boris@borismus.com
 * 
 */
public class ExpressoPlugin extends CordovaPlugin {

	private CallbackContext callbackContext = null;
	
	private AccountManager mAccountManager;

	@SuppressWarnings("deprecation")
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
	    try {
	        this.callbackContext = callbackContext;

	        if (action.equals("getAccounts")) {
	        	
	        	StringBuilder str = new StringBuilder();
	        	
	        	String accountType = "com.celepar.expresso.account";
	        	String authTokenType = "Acesso total";
	        	
	        	mAccountManager = AccountManager.get(cordova.getActivity().getApplicationContext());
	        	
	        	final Account availableAccounts[] = mAccountManager.getAccountsByType(accountType);
	        	
	        	JSONArray ja = new JSONArray();
	        	JSONObject j = new JSONObject();
	        	
	        	String authToken = "";
	        	
                String name[] = new String[availableAccounts.length];
                for (int i = 0; i < availableAccounts.length; i++) {
                    name[i] = availableAccounts[i].name;
                    
                    JSONObject js = new JSONObject();
                    
                    String accoutPassword = mAccountManager.getPassword(availableAccounts[i]);
                    
                    mAccountManager.getAuthToken(availableAccounts[i], accountType, null, null,
			                            null, null);
                    final Bundle bundle;
                    
                    try {
                    	bundle = mAccountManager.getAuthToken(availableAccounts[i], authTokenType, false, null, null).getResult();
                    	authToken = bundle.getString(AccountManager.KEY_AUTHTOKEN).toString();
                    	
                    } catch (Exception e) {
                    	
                    }
                    String[] arrayString = authToken.split(";",-1); 
                    
                    String accountAPIURL = arrayString[0];
                    authToken = arrayString[1];
                    
                    js.put("accountName", availableAccounts[i].name);
                    js.put("accountPassword", accoutPassword);
                    js.put("accountAPIURL", accountAPIURL);
                    js.put("accountAuthToken", authToken);
                    
                    ja.put(js);
                }
                
                j.put("accounts", ja);
                
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,j.toString()));
	            return true;

	        } else if (action.equals("createAccount")) {
	        	
	        	JSONObject params = args.getJSONObject(0);
	        	
	        	String accountName = params.has("accountName")
                ? params.getString("accountName")
                : "";
                
                String accountPassword = params.has("accountPassword")
                ? params.getString("accountPassword")
                : "";
                
                String accountAuthToken = params.has("accountAuthToken")
                ? params.getString("accountAuthToken")
                : "";
                
                String accountAPIURL = params.has("accountAPIURL")
                ? params.getString("accountAPIURL")
                : "";
                
                this.createAccount(accountName, accountPassword, accountAuthToken, accountAPIURL);
                
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
	            return true;
	        	
	        } else if (action.equals("saveImage")) {
	        	
	        	try {

	                String b64String = "";
	                b64String = args.getString(0);
	                JSONObject params = args.getJSONObject(1);

	                //Optional parameter
	                String filename = params.has("filename")
	                        ? params.getString("filename")
	                        : "b64Image_" + System.currentTimeMillis() + ".png";

	                String folder = params.has("folder")
	                        ? params.getString("folder")
	                        : Environment.getExternalStorageDirectory() + "/Pictures";

	                Boolean overwrite = params.has("overwrite") 
	                        ? params.getBoolean("overwrite") 
	                        : false;

	                this.saveImage(b64String, filename, folder, overwrite, callbackContext);

	            } catch (JSONException e) {

	                e.printStackTrace();
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION, e.getMessage()));
	                return false;

	            } catch (InterruptedException e) {
	                e.printStackTrace();
	                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION, e.getMessage()));
	                return false;
	            }
	            
	            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
	            return true;
	           
	        }

	        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
	        return false;
	    } catch (JSONException e) {
	        e.printStackTrace();
	        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
	        return false;
	    }
	}
    
    private void createAccount(String accountName, String accountPassword, String accountAuthToken, String accountAPIURL) {
    	
    	mAccountManager = AccountManager.get(cordova.getActivity().getApplicationContext());

        String accountType = "com.celepar.expresso.account";
        String authTokenType = "Acesso total";
        
        final Account account = new Account(accountName,accountType);

        mAccountManager.addAccountExplicitly(account, accountPassword, null);
        mAccountManager.setAuthToken(account, authTokenType, accountAPIURL + ";" + accountAuthToken);
    }
    
    private boolean saveImage(String b64String, String fileName, String dirName, Boolean overwrite, CallbackContext callbackContext) throws InterruptedException, JSONException {

        try {

            //Directory and File
            File dir = new File(dirName);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File file = new File(dirName, fileName);

            //Avoid overwriting a file
            if (!overwrite && file.exists()) {
                return false;
            }

            //Decode Base64 back to Binary format
            int flags = Base64.DEFAULT;
            
            byte[] decodedBytes = Base64.decode(b64String.getBytes(),flags);

            //Save Binary file to phone
            file.createNewFile();
            FileOutputStream fOut = new FileOutputStream(file);
            fOut.write(decodedBytes);
            fOut.close();
            
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, dirName.concat("/").concat(fileName)));
            
            return true;

        } catch (FileNotFoundException e) {
        	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "File not Found!"));
            return false;
        } catch (IOException e) {
        	callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, e.getMessage()));
            return false;
        }
    }


}