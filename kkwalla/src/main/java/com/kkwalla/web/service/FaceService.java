package com.kkwalla.web.service;

import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.springframework.stereotype.Service;


import com.kkwalla.web.util.FaceUtil;

@Service
public class FaceService {
	
	
	public String faceRecognize(String reImgSrc) throws ParseException, IOException {
		String result=FaceUtil.faceRecognize(reImgSrc);
		// result parser 
		JSONParser parser = new JSONParser();
		JSONObject infoObj = (JSONObject) parser.parse(result);
		JSONArray arr=(JSONArray) infoObj.get("faces");
		JSONObject emotionObj = (JSONObject) arr.get(0);
		JSONObject valueObj = (JSONObject) emotionObj.get("emotion");
		String emotion = (String) valueObj.get("value");
		
		return emotion;
	}
	
}
