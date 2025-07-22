package org.jobis.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/files")
public class FileUploadController {

    // (선택) 컨테이너 루트 경로가 필요하면 주입
    @Autowired
    private ServletContext servletContext;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    	System.out.println("경로 확인");
        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("업로드할 파일을 선택해주세요.");
        }

        try {
            // 1) 저장할 디렉터리 결정 (예: 웹앱 하위 resources/uploads)
            String uploadDir = servletContext.getRealPath("/resources/uploads");
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2) 파일명에 UUID 붙여서 저장(중복 방지)
            String original = file.getOriginalFilename();
            String filename = UUID.randomUUID().toString() 
                            + "_" 
                            + (original != null ? original.replaceAll("\\s+", "_") : "file");
            Path dest = uploadPath.resolve(filename);

            // 3) 디스크에 저장
            file.transferTo(dest.toFile());

            // 4) 응답에 저장된 경로 혹은 파일명 반환
            return ResponseEntity.ok()
                    .body(
                       Map.of(
                         "message", "업로드 성공",
                         "filename", filename,
                         "url", "/resources/uploads/" + filename
                       )
                    );
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("파일 저장 중 오류가 발생했습니다.");
        }
    }
}
