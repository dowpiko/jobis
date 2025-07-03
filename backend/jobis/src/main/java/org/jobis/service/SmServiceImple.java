package org.jobis.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.jobis.domain.CUserVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.mapper.SmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
public class SmServiceImple implements SmService {

    @Value("${key.compInfo}")
    private String compInfoKey;
    
    @Autowired
    private SmMapper mapper;
    
    // 아이디 중복확인
    @Override
    public int findUserId(String id) {
    	return mapper.findUserId(id) == 0 ? 0 : 1;
    }
    
    // 기업 불러오기
    @Override
    public ResponseEntity<String> findCompany(String crno) {
        try {
            // ✅ 파라미터 인코딩
            String encodedKey = URLEncoder.encode(compInfoKey, StandardCharsets.UTF_8.toString());

            // ✅ 최종 요청 URL
            String fullUrl = "http://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2"
                    + "?serviceKey=" + encodedKey
                    + "&pageNo=1"
                    + "&numOfRows=1"
                    + "&resultType=json"
                    + "&crno=" + crno;

            URI uri = URI.create(fullUrl);

            // ✅ 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("Accept-Charset", "UTF-8");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // ✅ RestTemplate 요청 (문자열로 받기)
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String json = response.getBody();

            // ✅ JSON 파싱 (Map 형태로 확인)
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parsed = objectMapper.readValue(json, Map.class);

            // ✅ UTF-8 Content-Type 명시하여 응답
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8").body(json);

        } catch (Exception e) {
            String errorJson = "{\"error\": \"API 호출 실패: " + e.getMessage() + "\"}";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8")
                    .body(errorJson);
        }
    };
    
    // 기업 등록
    @Override
    @Transactional
    public int insertCUser(CUserVO cuvo) {
    	return mapper.insertCUser(cuvo);
    };
    
    /* ----------------------------------------------------------------------------------- */
    
	// 면접 공고 등록    
    @Override
    public int insertInterView(InterViewBCVO ivbc) {
    	return mapper.insertInterView(ivbc);
    }
}
