package tadiran.gateserver.models;

import javax.persistence.*;

@Entity
@Table(name = "sup")
public class Sup {
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer id;


    @Column(name = "sup_name", nullable = false, length = 16)
    private String supName;

    @Column(name = "sup_extension", length = 8)
    private String supExtension;

    @Column(name = "sup_password", length = 8)
    private String supPassword;

    @Column(name = "p_nla_template_modif", nullable = false)
    private Character pNlaTemplateModif;

    @Column(name = "p_allow_to_save_public")
    private Character pAllowToSavePublic;

    @Column(name = "p_modify_sups")
    private Character pModifySups;

    @Column(name = "p_nla")
    private Character pNla;

    @Column(name = "p_fla")
    private Character pFla;

    @Column(name = "p_caa")
    private Character pCaa;

    @Column(name = "p_allow_to_modify_acd")
    private Character pAllowToModifyAcd;

    @Column(name = "p_rba")
    private Character pRba;

    @Column(name = "p_back_up_notification")
    private Character pBackUpNotification;

    @Column(name = "p_4")
    private Character p4;

    @Column(name = "p_5")
    private Character p5;

    @Column(name = "sup_hourly_int")
    private Integer supHourlyInt;

    @Column(name = "sup_level")
    private int supLevel;

    @Column(name = "severity")
    private Integer severity;

    @Column(name = "p_alarm")
    private Character pAlarm;

    @Column(name = "agent_id")
    private Integer agentId;

    @Column(name = "p_delete_active_alarm")
    private Character pDeleteActiveAlarm;

    @Column(name = "license_type")
    private Integer licenseType;

    @Column(name = "p_c2g")
    private Character pC2g;

    @Column(name = "p_c2g_rec")
    private Character pC2gRec;

    @Column(name = "tz_id")
    private Integer tzId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSupName() {
        return supName;
    }

    public void setSupName(String supName) {
        this.supName = supName;
    }

    public String getSupExtension() {
        return supExtension;
    }

    public void setSupExtension(String supExtension) {
        this.supExtension = supExtension;
    }

    public String getSupPassword() {
        return supPassword;
    }

    public void setSupPassword(String supPassword) {
        this.supPassword = supPassword;
    }

    public Character getPNlaTemplateModif() {
        return pNlaTemplateModif;
    }

    public void setPNlaTemplateModif(Character pNlaTemplateModif) {
        this.pNlaTemplateModif = pNlaTemplateModif;
    }

    public Character getPAllowToSavePublic() {
        return pAllowToSavePublic;
    }

    public void setPAllowToSavePublic(Character pAllowToSavePublic) {
        this.pAllowToSavePublic = pAllowToSavePublic;
    }

    public Character getPModifySups() {
        return pModifySups;
    }

    public void setPModifySups(Character pModifySups) {
        this.pModifySups = pModifySups;
    }

    public Character getPNla() {
        return pNla;
    }

    public void setPNla(Character pNla) {
        this.pNla = pNla;
    }

    public Character getPFla() {
        return pFla;
    }

    public void setPFla(Character pFla) {
        this.pFla = pFla;
    }

    public Character getPCaa() {
        return pCaa;
    }

    public void setPCaa(Character pCaa) {
        this.pCaa = pCaa;
    }

    public Character getPAllowToModifyAcd() {
        return pAllowToModifyAcd;
    }

    public void setPAllowToModifyAcd(Character pAllowToModifyAcd) {
        this.pAllowToModifyAcd = pAllowToModifyAcd;
    }

    public Character getPRba() {
        return pRba;
    }

    public void setPRba(Character pRba) {
        this.pRba = pRba;
    }

    public Character getPBackUpNotification() {
        return pBackUpNotification;
    }

    public void setPBackUpNotification(Character pBackUpNotification) {
        this.pBackUpNotification = pBackUpNotification;
    }

    public Character getP4() {
        return p4;
    }

    public void setP4(Character p4) {
        this.p4 = p4;
    }

    public Character getP5() {
        return p5;
    }

    public void setP5(Character p5) {
        this.p5 = p5;
    }

    public Integer getSupHourlyInt() {
        return supHourlyInt;
    }

    public void setSupHourlyInt(Integer supHourlyInt) {
        this.supHourlyInt = supHourlyInt;
    }

    public Integer getSupLevel() {
        return supLevel;
    }

    public void setSupLevel(Integer supLevel) {
        this.supLevel = supLevel;
    }

    public Integer getSeverity() {
        return severity;
    }

    public void setSeverity(Integer severity) {
        this.severity = severity;
    }

    public Character getPAlarm() {
        return pAlarm;
    }

    public void setPAlarm(Character pAlarm) {
        this.pAlarm = pAlarm;
    }

    public Integer getAgentId() {
        return agentId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }

    public Character getPDeleteActiveAlarm() {
        return pDeleteActiveAlarm;
    }

    public void setPDeleteActiveAlarm(Character pDeleteActiveAlarm) {
        this.pDeleteActiveAlarm = pDeleteActiveAlarm;
    }

    public Integer getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(Integer licenseType) {
        this.licenseType = licenseType;
    }

    public Character getPC2g() {
        return pC2g;
    }

    public void setPC2g(Character pC2g) {
        this.pC2g = pC2g;
    }

    public Character getPC2gRec() {
        return pC2gRec;
    }

    public void setPC2gRec(Character pC2gRec) {
        this.pC2gRec = pC2gRec;
    }

    public Integer getTzId() {
        return tzId;
    }

    public void setTzId(Integer tzId) {
        this.tzId = tzId;
    }

}
