package com.celepar.expresso;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import java.security.KeyStore;
import java.util.Date;


import org.json.JSONException;
import org.json.JSONObject;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.net.SocketTimeoutException;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Toast;
import java.io.IOException;

import com.celepar.expresso.R;





public class JsonClient extends AsyncTask<String, Void, String> {
    private static JsonClient ourInstance = new JsonClient();
    private static Context context;
    private String url = "";
    private String method = "";
    private int timeout = 10000;
    private String auth;
    private JSONObject response;
    private Date lastCheckDate;
    private boolean canMakeRequest = true;


    String charset = "UTF-8";
    HttpURLConnection conn;
    DataOutputStream wr;
    StringBuilder result = new StringBuilder();
    URL urlObj;
    JSONObject jObj = null;
    StringBuilder sbParams;
    String paramsString;
    
    public void setLastCheckDate(Date date){
        this.lastCheckDate = date;
    }
    
    public Date getLastCheckDate(){
        return this.lastCheckDate;
    }

    public void setMethod(String method){
        this.method = method;
    }
    
    public void setURL(String url){
        this.url = url;
    }

    public String getURL(){
        return this.url;
    }
    
    public void setAuth(String auth){
        this.auth = auth;
    }
    
    public String getAuth(){
        return auth;
    }
    public static JsonClient getInstance() {        
        return ourInstance;
    }

    private void setContext(Context context){
        JsonClient.context = context;
    }

    private Context getContext(){
        return JsonClient.context;
    }

    private JsonClient() {

    }

    public JSONObject getResponse(){
        return this.response;
    }

    public void setResponse(JSONObject response){
        this.response = response;
    }
    
    public void setCanMakeRequest(boolean value){
        this.canMakeRequest = value;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }
    
    @Override
    protected String doInBackground(String... paramsStr) {

        

        // Log.d("JsonClient",Arrays.toString(paramsStr));
        // Log.d("JsonClient",paramsStr[1]);

        Log.d("JsonClient",this.url + this.method);

        // String id = paramsStr[0];
        // String params = paramsStr[1];

        // sbParams = new StringBuilder();

        // try {
        //     sbParams.append("id").append("=")
        //             .append(URLEncoder.encode(id, charset));
        //     sbParams.append("&");
        //     sbParams.append("params").append("=")
        //             .append(URLEncoder.encode(params, charset));
        // } catch (UnsupportedEncodingException e) {
        //     e.printStackTrace();
        // }

        // try {

        //     Log.d("JsonClient",this.url + this.method);

        //     urlObj = new URL(this.url + this.method);

        //     conn = (HttpURLConnection) urlObj.openConnection();

        //     conn.setDoOutput(true);

        //     conn.setRequestMethod("POST");

        //     conn.setRequestProperty("Accept-Charset", charset);

        //     conn.setReadTimeout(10000);
        //     conn.setConnectTimeout(15000);

        //     conn.connect();

        //     paramsString = sbParams.toString();

        //     wr = new DataOutputStream(conn.getOutputStream());
        //     wr.writeBytes(paramsString);
        //     wr.flush();
        //     wr.close();

        // } catch (IOException e) {
        //     e.printStackTrace();
        // }

        // try {
        //     //response from the server
        //     InputStream in = new BufferedInputStream(conn.getInputStream());
        //     BufferedReader reader = new BufferedReader(new InputStreamReader(in));

        //     String line;
        //     while ((line = reader.readLine()) != null) {
        //         result.append(line);
        //     }


        // } catch (IOException e) {
        //     e.printStackTrace();
        // }

        // conn.disconnect();

        return result.toString();
    }

    @Override
    protected void onPostExecute(String result){
        String s = result.trim();

    }

    public void call(Context context, String method, JSONObject params, int id) throws JSONException {
        JSONObject response = new JSONObject();

        setContext(context);

        Log.d("JsonClient","URL:" + this.url + method);

        // System.out.println("JsonClient JAIR");

        if (this.canMakeRequest == true) {

            if(isNetworkAvailable() != false){

                Log.d("JsonClient","EXECUTE");

                this.execute();
    
            }
    //         setResponse(response);
        
        } else {
            System.out.println("CAN'T MAKE REQUESTS");
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivity = (ConnectivityManager) getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivity != null) {
            NetworkInfo[] info = connectivity.getAllNetworkInfo();
            if (info != null) {
                for (int i = 0; i < info.length; i++) {
                    if (info[i].getState() == NetworkInfo.State.CONNECTED) {
                        return true;
                    }
                }
            }
        }
        return false;
    }    
}
    
    // public HttpClient getNewHttpClient() {
    //     try {
    //         KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
    //         trustStore.load(null, null);

    //         SSLSocketFactory sf = new MySSLSocketFactory(trustStore);
    //         sf.setHostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);

    //         HttpParams params = new BasicHttpParams();
    //         HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
    //         HttpProtocolParams.setContentCharset(params, HTTP.UTF_8);

    //         SchemeRegistry registry = new SchemeRegistry();
    //         registry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
    //         registry.register(new Scheme("https", sf, 443));

    //         ClientConnectionManager ccm = new ThreadSafeClientConnManager(params, registry);

    //         return new DefaultHttpClient(ccm, params);
    //     } catch (Exception e) {
    //         return new DefaultHttpClient();
    //     }
    // }


    //             HttpParams httpParams = new BasicHttpParams();
    //             HttpConnectionParams.setConnectionTimeout(httpParams, timeout);
    //             HttpConnectionParams.setSoTimeout(httpParams, timeout);
                
    // //            HttpClient client = new DefaultHttpClient(httpParams);
    //             HttpClient client = this.getNewHttpClient();

 //                Log.d("JsonClient","URL:" + url + method);
        
    //             HttpPost httpPost = new HttpPost(url + method);
 //                //httpPost.setHeader("host", url);
    //             httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
    //             httpPost.setHeader("Accept", "application/json");
        
    //             try {
                    
    //                 StringEntity entity = new StringEntity("id=" + id + "&params=" + params.toString());
                    
    //                 httpPost.setEntity(entity);
    //                 ResponseHandler<String> handler = new BasicResponseHandler();
    //                 response = new JSONObject(client.execute(httpPost, handler));
    
    //             } catch (SocketTimeoutException e) {
    //                 response.put("error",context.getString(R.string.timeout_network));
                    
    //             } catch (HttpResponseException e) {
    //                 switch (e.getStatusCode()){                
    //                     case 503:
    //                         response.put("error",context.getString(R.string.unavailable_service));
    //                         break;
    //                     case 404:
    //                         response.put("error",context.getString(R.string.invalid_service));
    //                     case 403:
    //                         response.put("error",context.getString(R.string.forbidden_access_service));
    //                         break;
    //                     default:
    //                         response.put("error","HTTPResponseException:"+e.getStatusCode());
    //                         break;
    //                 }
    //             }
    //             catch (Throwable e) {
    //                 response.put("error", "Exception:"+e.getLocalizedMessage());
    //             }    
    //         }
    //         else {
    //             response.put("error", context.getString(R.string.unavailable_network));


    
    


/*

import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import org.json.JSONObject;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class MainActivity extends AppCompatActivity {

    private EditText editTextUserName;
    private EditText editTextPassword;

    public static final String USER_NAME = "USERNAME";

    String username;
    String password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editTextUserName = (EditText) findViewById(R.id.editTextUserName);
        editTextPassword = (EditText) findViewById(R.id.editTextPassword);
    }

    public void invokeLogin(View view){
        username = editTextUserName.getText().toString();
        password = editTextPassword.getText().toString();

        login(username,password);

    }

    private void login(final String username, String password) {

        class LoginAsync extends AsyncTask<String, Void, String>{

            private Dialog loadingDialog;
            String url = "http://shaadi.web44.net/hello.php";

            String charset = "UTF-8";
            HttpURLConnection conn;
            DataOutputStream wr;
            StringBuilder result = new StringBuilder();
            URL urlObj;
            JSONObject jObj = null;
            StringBuilder sbParams;
            String paramsString;

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loadingDialog = ProgressDialog.show(MainActivity.this, "Please wait", "Loading...");
            }

            @Override
            protected String doInBackground(String... params) {
                String uname = params[0];
                String pass = params[1];

                sbParams = new StringBuilder();

                try {
                    sbParams.append("name").append("=")
                            .append(URLEncoder.encode(uname, charset));
                    sbParams.append("&");
                    sbParams.append("password").append("=")
                            .append(URLEncoder.encode(pass, charset));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

                try {
                    urlObj = new URL(url);

                    conn = (HttpURLConnection) urlObj.openConnection();

                    conn.setDoOutput(true);

                    conn.setRequestMethod("POST");

                    conn.setRequestProperty("Accept-Charset", charset);

                    conn.setReadTimeout(10000);
                    conn.setConnectTimeout(15000);

                    conn.connect();

                    paramsString = sbParams.toString();

                    wr = new DataOutputStream(conn.getOutputStream());
                    wr.writeBytes(paramsString);
                    wr.flush();
                    wr.close();

                } catch (IOException e) {
                    e.printStackTrace();
                }

                try {
                    //response from the server
                    InputStream in = new BufferedInputStream(conn.getInputStream());
                    BufferedReader reader = new BufferedReader(new InputStreamReader(in));

                    String line;
                    while ((line = reader.readLine()) != null) {
                        result.append(line);
                    }


                } catch (IOException e) {
                    e.printStackTrace();
                }

                conn.disconnect();

                return result.toString();
            }

            @Override
            protected void onPostExecute(String result){
                String s = result.trim();
                loadingDialog.dismiss();
                if(s.equalsIgnoreCase("success")){
                    Intent intent = new Intent(MainActivity.this, UserProfile.class);
                    intent.putExtra(USER_NAME, username);
                    finish();
                    startActivity(intent);
                }else {
                    Toast.makeText(getApplicationContext(), "Invalid User Name or Password", Toast.LENGTH_LONG).show();
                }
            }
        }

        LoginAsync la = new LoginAsync();
        la.execute(username, password);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}

*/