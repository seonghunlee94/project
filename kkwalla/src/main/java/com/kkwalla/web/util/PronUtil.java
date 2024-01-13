package com.kkwalla.web.util;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.google.gson.Gson;

public class PronUtil {

	private static final String SECRET = "     "; // 개인 정보
	private static final String INVOKE_URL = "https://clovaspeech-gw.ncloud.com/external/v1/991/94a5d303a1c1bd1b378a109c3ae815872dbe10e48fdc03d52997c3305648ed03";

	private CloseableHttpClient httpClient = HttpClients.createDefault();
	private Gson gson = new Gson();

	private static final Header[] HEADERS = new Header[] {
		new BasicHeader("Accept", "application/json"),
		new BasicHeader("X-CLOVASPEECH-API-KEY", SECRET),
	};

	public static class Boosting {
		private String words;

		public String getWords() {
			return words;
		}

		public void setWords(String words) {
			this.words = words;
		}
	}

	public String upload(File file, String completion, String callback, Map<String, Object> userdata,
		String forbiddens, List<Boosting> boostings) {
		HttpPost httpPost = new HttpPost(INVOKE_URL + "/recognizer/upload");
		httpPost.setHeaders(HEADERS);
		Map<String, Object> body = new HashMap<>();
		body.put("language", "ko-KR");
		body.put("callback", callback);
		body.put("completion", completion);
		body.put("userdata", userdata);
		body.put("forbiddens", forbiddens);
		body.put("boostings", boostings);
		HttpEntity httpEntity = MultipartEntityBuilder.create()
			.addTextBody("params", gson.toJson(body), ContentType.APPLICATION_JSON)
			.addBinaryBody("media", file, ContentType.MULTIPART_FORM_DATA, file.getName())
			.build();
		httpPost.setEntity(httpEntity);
		return execute(httpPost);
	}

	private String execute(HttpPost httpPost) {
		try (final CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
			final HttpEntity entity = httpResponse.getEntity();
			return EntityUtils.toString(entity, StandardCharsets.UTF_8);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static String request(String fileName) { // 음성 파일 경로를 받아서 json파일을 돌려받는다.
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("dataId", 1);
		
		JSONObject jsonObject1 = new JSONObject();
		jsonObject1.put("words", "comma separated words");
		
		JSONArray jsonArray = new JSONArray();
		jsonArray.add(jsonObject1);
		
		final PronUtil clovaSpeechClient = new PronUtil();
		final String result = clovaSpeechClient.upload(new File("src\\main\\webapp\\WEB-INF\\audio\\"+fileName), "sync", "http://example/callback", jsonObject, "comma separated words", jsonArray);
		return result;
	}
}