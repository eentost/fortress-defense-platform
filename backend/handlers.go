package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Threat represents a detected threat
type Threat struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Type        string `json:"type"`        // Malware, Intrusion, DataExfiltration
	Source      string `json:"source"`      // IP address
	Target      string `json:"target"`      // Target resource
	Severity    string `json:"severity"`    // Critical, High, Medium, Low
	Status      string `json:"status"`      // Detected, Mitigated, Resolved
	Description string `json:"description"`
	Timestamp   int64  `json:"timestamp"`
}

// Alert represents an alert to admins
type Alert struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	ThreatID uint   `json:"threat_id"`
	Message  string `json:"message"`
	Status   string `json:"status"` // Open, Acknowledged, Resolved
	Timestamp int64 `json:"timestamp"`
}

// MitigationAction represents an action taken to mitigate threats
type MitigationAction struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	ThreatID uint   `json:"threat_id"`
	Action   string `json:"action"`   // Block, Isolate, Quarantine
	Result   string `json:"result"`   // Success, Partial, Failed
	Timestamp int64 `json:"timestamp"`
}

func getThreats(c *gin.Context) {
	var threats []Threat
	db.Find(&threats)
	c.JSON(http.StatusOK, threats)
}

func createThreat(c *gin.Context) {
	var threat Threat
	if err := c.ShouldBindJSON(&threat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Create(&threat)
	c.JSON(http.StatusCreated, threat)
}

func getThreat(c *gin.Context) {
	id := c.Param("id")
	var threat Threat

	if err := db.First(&threat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Threat not found"})
		return
	}

	c.JSON(http.StatusOK, threat)
}

func updateThreat(c *gin.Context) {
	id := c.Param("id")
	var threat Threat

	if err := db.First(&threat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Threat not found"})
		return
	}

	if err := c.ShouldBindJSON(&threat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&threat)
	c.JSON(http.StatusOK, threat)
}

func getAlerts(c *gin.Context) {
	var alerts []Alert
	db.Find(&alerts)
	c.JSON(http.StatusOK, alerts)
}

func createAlert(c *gin.Context) {
	var alert Alert
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Create(&alert)
	c.JSON(http.StatusCreated, alert)
}

func mitigateThread(c *gin.Context) {
	var action MitigationAction
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create mitigation action
	db.Create(&action)

	// Update threat status
	var threat Threat
	if err := db.First(&threat, action.ThreatID).Error; err == nil {
		threat.Status = "Mitigated"
		db.Save(&threat)
	}

	c.JSON(http.StatusCreated, action)
}
