package com.campus.portal.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private String type;      // LOST / FOUND
    private String title;     // item name (BIKE KEYS)
    private String location;  // place (Library, Block A)
    private String date;      // formatted date (08 Apr 7:20 PM)
}