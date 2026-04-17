package com.campus.portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.portal.dto.ReportDTO;
import com.campus.portal.service.ItemService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public ReportDTO getReports() {
        return itemService.getReportData();
    }
}