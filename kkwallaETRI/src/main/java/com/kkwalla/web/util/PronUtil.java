package com.kkwalla.web.util;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
 
import com.google.gson.Gson;
 
public class PronUtil {
	private static final String OPENAPIURL = "http://aiopen.etri.re.kr:8000/WiseASR/Recognition";
	private static final String ACCESSKEY = " 개인 정보 ";    // 발급받은 API Key
	private static final String LANGUAGECODE = "korean";     // 언어 코드
 
    public static String request (String fileName) {
        String audioFilePath = "src\\main\\webapp\\WEB-INF\\audio\\"+fileName;  // 녹음된 음성 파일 경로
        String audioContents = null;
        Gson gson = new Gson();
 
        Map<String, Object> request = new HashMap<>();
        Map<String, String> argument = new HashMap<>();
 
        try {
            Path path = Paths.get(audioFilePath);
            byte[] audioBytes = Files.readAllBytes(path);
            audioContents = Base64.getEncoder().encodeToString(audioBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
 
        argument.put("language_code", LANGUAGECODE);
        argument.put("audio", audioContents);
 
        request.put("access_key", ACCESSKEY);
        request.put("argument", argument);
 
        URL url;
        Integer responseCode = null;
        String responBody = null;
        try {
            url = new URL(OPENAPIURL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setRequestMethod("POST");
            con.setDoOutput(true);
 
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.write(gson.toJson(request).getBytes("UTF-8"));
            wr.flush();
            wr.close();
 
            responseCode = con.getResponseCode();
            InputStream is = con.getInputStream();
            byte[] buffer = new byte[is.available()];
            int byteRead = is.read(buffer);
            responBody = new String(buffer);
 
            System.out.println("[responseCode] " + responseCode);
            System.out.println("[responBody]");
            System.out.println(responBody);
            return responBody;           
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return "URL이 맞는지 다시 확인해주세요";
        } catch (IOException e) {
            e.printStackTrace();
            return "데이터 입출력 오류";
        }
        
    }
}