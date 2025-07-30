package org.jobis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AiInterviewServiceImple implements AiInterviewService{

    @Value("${clova.api.key}")
    private String clovaApiKey;
    
    @Value("${clova.invoke.url}")
    private String clovaInvokeUrl;
    
    @Value("${ncloud.endpoint}")
    private String endPoint;
    
    @Value("${ncloud.bucket.name}")
    private String bucketName;
    
    @Value("${ncloud.access.key}")
    private String accessKey;
    
    @Value("${ncloud.secret.key}")
    private String secretKey;
    
    @Override
    public String convertVoiceToText(MultipartFile file) {
        try {
            AmazonS3 s3 = AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, "kr-standard"))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
                .enablePathStyleAccess()
                .build();

            String objectName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("audio/wav");
            metadata.setContentLength(file.getSize());

            PutObjectRequest request = new PutObjectRequest(bucketName, objectName, file.getInputStream(), metadata);
            request.setCannedAcl(CannedAccessControlList.PublicRead);
            s3.putObject(request);

            String dataKey = objectName;
            System.out.println("📦 업로드된 파일 경로 (dataKey): " + dataKey);

            URL url = new URL(clovaInvokeUrl + "/recognizer/object-storage");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("X-CLOVASPEECH-API-KEY", clovaApiKey);

            JSONObject body = new JSONObject();
            body.put("dataKey", dataKey);
            body.put("language", "ko-KR");
            body.put("completion", "sync");
            body.put("wordAlignment", true);
            body.put("fullText", true);

            System.out.println("📨 전송할 JSON: " + body.toString());

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            System.out.println("📡 Clova 응답 코드: " + responseCode);

            if (responseCode == 200) {
                String response = new BufferedReader(new InputStreamReader(conn.getInputStream()))
                        .lines().collect(Collectors.joining());
                System.out.println("✅ Clova 응답 결과: " + response);

                JSONObject json = new JSONObject(response);
                return json.optString("text", "");  // text가 비어있을 수 있음
            } else {
                String error = new BufferedReader(new InputStreamReader(conn.getErrorStream()))
                        .lines().collect(Collectors.joining());
                System.out.println("❌ STT 실패: " + error);
                return "❌ STT 실패: " + error;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "🔥 서버 오류: " + e.getMessage();
        }
    }
}
