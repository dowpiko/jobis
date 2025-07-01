package org.jobis.service;

import java.util.concurrent.TimeUnit;

import org.jobis.domain.UserVO;
import org.jobis.mapper.JshMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class JshServiceImple implements JshService{

    @Autowired private JavaMailSender mailSender;

    @Autowired private StringRedisTemplate redisTemplate;
    
    @Autowired private JshMapper jsmMapper;
    
    @Override
    public boolean checkId(String id) {    	
    	return jsmMapper.findUserId(id) == 0 ? true : false;
    }
    
    @Override
    public boolean registerUser(UserVO userVO) {    	
    	return jsmMapper.registerUser(userVO) > 0 ? true : false;
    }
    
	@Override
	public void sendVerificationCode(String email) {
		String code = String.valueOf((int)(Math.random() * 900000) + 100000);
		redisTemplate.opsForValue().set("verify:" + email, code, 5, TimeUnit.MINUTES);

		SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(email);
	    message.setSubject("이메일 인증 코드");
	    message.setText("인증코드: " + code);
	    message.setFrom("tjdgus3877@naver.com");
	    mailSender.send(message);	
	}
	
	@Override
	public boolean verifyCode(String email, String inputCode) {
		String key = "verify:" + email;
        String storedCode = redisTemplate.opsForValue().get(key);
        if (storedCode != null && storedCode.equals(inputCode)) {
            redisTemplate.delete(key);
            return true;
        }
        return false;
	}
}
