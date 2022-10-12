package tadiran.gateserver.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "agent", uniqueConstraints = {
        @UniqueConstraint(columnNames = "a_name"),
        @UniqueConstraint(columnNames = "agent_id")
    })
public class Agent {
    @Id
    @Column(name = "agent_id", nullable = false)
    private Integer id;


    @NotBlank
    @Column(name = "a_name", nullable = false, length = 32)
    private String aName;

    @Column(name = "a_number", nullable = false, length = 8)
    private String aNumber;

    @Column(name = "a_salary")
    private Double aSalary;

    @Column(name = "a_password", length = 8)
    private String aPassword;

    @Column(name = "a_is_logged")
    private Character aIsLogged;

    @Column(name = "a_date_log")
    private LocalDate aDateLog;

    @Column(name = "a_gr_select_str")
    private Integer aGrSelectStr;

    @Column(name = "a_call_select_str")
    private Integer aCallSelectStr;

    @Column(name = "agent_status")
    private Character agentStatus;

    @Column(name = "del_date")
    private LocalDate delDate;

    @Column(name = "del_time", length = 9)
    private String delTime;

    @Column(name = "last_agent_strategy_first")
    private Integer lastAgentStrategyFirst;

    @Column(name = "email_signature")
    private String emailSignature;

    @Column(name = "logging_flag")
    private Integer loggingFlag;

    @Column(name = "personal_email_account", length = 64)
    private String personalEmailAccount;

    @Column(name = "a_call_select_str_sec_enabled")
    private Integer aCallSelectStrSecEnabled;

    @Column(name = "a_call_select_str_sec")
    private Integer aCallSelectStrSec;

    @Column(name = "personal_email_password", length = 64)
    private String personalEmailPassword;

    @Column(name = "auto_answer_flag")
    private Integer autoAnswerFlag;

    @Column(name = "ani_number_outbound", length = 20)
    private String aniNumberOutbound;

    public Agent() {
    }

    public Agent(String a_name, String a_password) {
        this.aName = a_name;
        this.aPassword = a_password;
       /* this.password = password;*/
        //this.roles = roles;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAName() {
        return aName;
    }

    public void setAName(String aName) {
        this.aName = aName;
    }

    public String getANumber() {
        return aNumber;
    }

    public void setANumber(String aNumber) {
        this.aNumber = aNumber;
    }

    public Double getASalary() {
        return aSalary;
    }

    public void setASalary(Double aSalary) {
        this.aSalary = aSalary;
    }

    public String getAPassword() {
        return aPassword;
    }

    public void setAPassword(String aPassword) {
        this.aPassword = aPassword;
    }

    public Character getAIsLogged() {
        return aIsLogged;
    }

    public void setAIsLogged(Character aIsLogged) {
        this.aIsLogged = aIsLogged;
    }

    public LocalDate getADateLog() {
        return aDateLog;
    }

    public void setADateLog(LocalDate aDateLog) {
        this.aDateLog = aDateLog;
    }

    public Integer getAGrSelectStr() {
        return aGrSelectStr;
    }

    public void setAGrSelectStr(Integer aGrSelectStr) {
        this.aGrSelectStr = aGrSelectStr;
    }

    public Integer getACallSelectStr() {
        return aCallSelectStr;
    }

    public void setACallSelectStr(Integer aCallSelectStr) {
        this.aCallSelectStr = aCallSelectStr;
    }

    public Character getAgentStatus() {
        return agentStatus;
    }

    public void setAgentStatus(Character agentStatus) {
        this.agentStatus = agentStatus;
    }

    public LocalDate getDelDate() {
        return delDate;
    }

    public void setDelDate(LocalDate delDate) {
        this.delDate = delDate;
    }

    public String getDelTime() {
        return delTime;
    }

    public void setDelTime(String delTime) {
        this.delTime = delTime;
    }

    public Integer getLastAgentStrategyFirst() {
        return lastAgentStrategyFirst;
    }

    public void setLastAgentStrategyFirst(Integer lastAgentStrategyFirst) {
        this.lastAgentStrategyFirst = lastAgentStrategyFirst;
    }

    public String getEmailSignature() {
        return emailSignature;
    }

    public void setEmailSignature(String emailSignature) {
        this.emailSignature = emailSignature;
    }

    public Integer getLoggingFlag() {
        return loggingFlag;
    }

    public void setLoggingFlag(Integer loggingFlag) {
        this.loggingFlag = loggingFlag;
    }

    public String getPersonalEmailAccount() {
        return personalEmailAccount;
    }

    public void setPersonalEmailAccount(String personalEmailAccount) {
        this.personalEmailAccount = personalEmailAccount;
    }

    public Integer getACallSelectStrSecEnabled() {
        return aCallSelectStrSecEnabled;
    }

    public void setACallSelectStrSecEnabled(Integer aCallSelectStrSecEnabled) {
        this.aCallSelectStrSecEnabled = aCallSelectStrSecEnabled;
    }

    public Integer getACallSelectStrSec() {
        return aCallSelectStrSec;
    }

    public void setACallSelectStrSec(Integer aCallSelectStrSec) {
        this.aCallSelectStrSec = aCallSelectStrSec;
    }

    public String getPersonalEmailPassword() {
        return personalEmailPassword;
    }

    public void setPersonalEmailPassword(String personalEmailPassword) {
        this.personalEmailPassword = personalEmailPassword;
    }

    public Integer getAutoAnswerFlag() {
        return autoAnswerFlag;
    }

    public void setAutoAnswerFlag(Integer autoAnswerFlag) {
        this.autoAnswerFlag = autoAnswerFlag;
    }

    public String getAniNumberOutbound() {
        return aniNumberOutbound;
    }

    public void setAniNumberOutbound(String aniNumberOutbound) {
        this.aniNumberOutbound = aniNumberOutbound;
    }

}
