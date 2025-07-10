package org.jobis.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOfferDTO {
	private int ono;              
    private String corpName;      
    private String profileImage;  
    private String category;      
    private String title;         
}
