package com.campus.portal.dto;

import java.util.Map;

public class ReportDTO {

    private long lost;
    private long found;
    private long matched;
    private long resolved;
    private long pending;

    private Map<String, Long> categoryData;
    private Map<String, Long> monthlyLost;
    private Map<String, Long> monthlyMatched;
    private Map<String, Long> monthlyFound;

    public long getLost() { return lost; }
    public void setLost(long lost) { this.lost = lost; }

    public long getFound() { return found; }
    public void setFound(long found) { this.found = found; }

    public long getMatched() { return matched; }
    public void setMatched(long matched) { this.matched = matched; }

    public long getResolved() { return resolved; }
    public void setResolved(long resolved) { this.resolved = resolved; }
     public long getPending() { return pending; } // ✅ ADD
    public void setPending(long pending) { this.pending = pending; } // ✅ ADD


    public Map<String, Long> getCategoryData() { return categoryData; }
    public void setCategoryData(Map<String, Long> categoryData) { this.categoryData = categoryData; }

    public Map<String, Long> getMonthlyLost() { return monthlyLost; }
    public void setMonthlyLost(Map<String, Long> monthlyLost) { this.monthlyLost = monthlyLost; }

    public Map<String, Long> getMonthlyMatched() { return monthlyMatched; }
    public void setMonthlyMatched(Map<String, Long> monthlyMatched) { this.monthlyMatched = monthlyMatched; }

public Map<String, Long> getMonthlyFound() {
    return monthlyFound;
}public void setMonthlyFound(Map<String, Long> monthlyFound) {
    this.monthlyFound = monthlyFound;
}
}