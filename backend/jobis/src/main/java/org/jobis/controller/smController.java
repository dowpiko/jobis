package org.jobis.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
public class smController {

    @GetMapping("/api/corp-info")
    @CrossOrigin(origins = "http://localhost:3000") // 리액트 개발 주소에서 접근 허용
    @ResponseBody
    public String getCorpInfo(@RequestParam("corpNm") String corpNm) {
        // ✅ 반드시 인코딩된 서비스키 사용
        String serviceKey = "AL13m1rdCjgl5fKqwgX8sD9EKAnlLasFAIHX4MUEl4XlbUeGf2z6%2Bvq4O%2BELiv%2FLiGrFsayi09%2FRohzxaDHUUg%3D%3D";
        String apiUrl = "https://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2";
        
        try {
        	
        	String encodedCorpNm = URLEncoder.encode(corpNm, StandardCharsets.UTF_8.toString());
        	
            String requestUrl = apiUrl
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1"
                    + "&numOfRows=10"
                    + "&resultType=json"
                    + "&corpNm=" + encodedCorpNm; // ← 인코딩 하지 않음
            System.out.println(encodedCorpNm);
            
            System.out.println("최종 요청 URL 👉 " + requestUrl);

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(requestUrl, String.class);

            return response;

        } catch (Exception e) {
            return "{\"error\": \"API 호출 실패: " + e.getMessage() + "\"}";
        }
    }
}
