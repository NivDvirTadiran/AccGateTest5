package tadiran.gateserver.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "classes_of_service")
public class ClassesOfService {
    @Id
    @Column(name = "cos_id", nullable = false)
    private Integer id;

    @Column(name = "cos_name", nullable = false, length = 32)
    private String cosName;

    @Column(name = "acd_pickup_from_queue")
    private Integer acdPickupFromQueue;

    @Column(name = "acd_specific_login")
    private Integer acdSpecificLogin;

    @Column(name = "disp_change_toolbar_layout")
    private Integer dispChangeToolbarLayout;

    @Column(name = "disp_change_windows_layout")
    private Integer dispChangeWindowsLayout;

    @Column(name = "call_status_window")
    private Integer callStatusWindow;

    @Column(name = "acd_call_window")
    private Integer acdCallWindow;

    @Column(name = "calls_log_window")
    private Integer callsLogWindow;

    @Column(name = "setup_window")
    private Integer setupWindow;

    @Column(name = "telephony_window")
    private Integer telephonyWindow;

    @Column(name = "agentboard_window")
    private Integer agentboardWindow;

    @Column(name = "chat_tree_window")
    private Integer chatTreeWindow;

    @Column(name = "voice_calls")
    private Integer voiceCalls;

    @Column(name = "chat_contacts")
    private Integer chatContacts;

    @Column(name = "email_contacts")
    private Integer emailContacts;

    @Column(name = "chat_while_on_voice")
    private Integer chatWhileOnVoice;

    @Column(name = "email_while_on_voice")
    private Integer emailWhileOnVoice;

    @Column(name = "email_while_on_Chat")
    private Integer emailWhileOnChat;

    @Column(name = "enable_dde4outgoing")
    private Integer enableDde4outgoing;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCosName() {
        return cosName;
    }

    public void setCosName(String cosName) {
        this.cosName = cosName;
    }

    public Integer getAcdPickupFromQueue() {
        return acdPickupFromQueue;
    }

    public void setAcdPickupFromQueue(Integer acdPickupFromQueue) {
        this.acdPickupFromQueue = acdPickupFromQueue;
    }

    public Integer getAcdSpecificLogin() {
        return acdSpecificLogin;
    }

    public void setAcdSpecificLogin(Integer acdSpecificLogin) {
        this.acdSpecificLogin = acdSpecificLogin;
    }

    public Integer getDispChangeToolbarLayout() {
        return dispChangeToolbarLayout;
    }

    public void setDispChangeToolbarLayout(Integer dispChangeToolbarLayout) {
        this.dispChangeToolbarLayout = dispChangeToolbarLayout;
    }

    public Integer getDispChangeWindowsLayout() {
        return dispChangeWindowsLayout;
    }

    public void setDispChangeWindowsLayout(Integer dispChangeWindowsLayout) {
        this.dispChangeWindowsLayout = dispChangeWindowsLayout;
    }

    public Integer getCallStatusWindow() {
        return callStatusWindow;
    }

    public void setCallStatusWindow(Integer callStatusWindow) {
        this.callStatusWindow = callStatusWindow;
    }

    public Integer getAcdCallWindow() {
        return acdCallWindow;
    }

    public void setAcdCallWindow(Integer acdCallWindow) {
        this.acdCallWindow = acdCallWindow;
    }

    public Integer getCallsLogWindow() {
        return callsLogWindow;
    }

    public void setCallsLogWindow(Integer callsLogWindow) {
        this.callsLogWindow = callsLogWindow;
    }

    public Integer getSetupWindow() {
        return setupWindow;
    }

    public void setSetupWindow(Integer setupWindow) {
        this.setupWindow = setupWindow;
    }

    public Integer getTelephonyWindow() {
        return telephonyWindow;
    }

    public void setTelephonyWindow(Integer telephonyWindow) {
        this.telephonyWindow = telephonyWindow;
    }

    public Integer getAgentboardWindow() {
        return agentboardWindow;
    }

    public void setAgentboardWindow(Integer agentboardWindow) {
        this.agentboardWindow = agentboardWindow;
    }

    public Integer getChatTreeWindow() {
        return chatTreeWindow;
    }

    public void setChatTreeWindow(Integer chatTreeWindow) {
        this.chatTreeWindow = chatTreeWindow;
    }

    public Integer getVoiceCalls() {
        return voiceCalls;
    }

    public void setVoiceCalls(Integer voiceCalls) {
        this.voiceCalls = voiceCalls;
    }

    public Integer getChatContacts() {
        return chatContacts;
    }

    public void setChatContacts(Integer chatContacts) {
        this.chatContacts = chatContacts;
    }

    public Integer getEmailContacts() {
        return emailContacts;
    }

    public void setEmailContacts(Integer emailContacts) {
        this.emailContacts = emailContacts;
    }

    public Integer getChatWhileOnVoice() {
        return chatWhileOnVoice;
    }

    public void setChatWhileOnVoice(Integer chatWhileOnVoice) {
        this.chatWhileOnVoice = chatWhileOnVoice;
    }

    public Integer getEmailWhileOnVoice() {
        return emailWhileOnVoice;
    }

    public void setEmailWhileOnVoice(Integer emailWhileOnVoice) {
        this.emailWhileOnVoice = emailWhileOnVoice;
    }

    public Integer getEmailWhileOnChat() {
        return emailWhileOnChat;
    }

    public void setEmailWhileOnChat(Integer emailWhileOnChat) {
        this.emailWhileOnChat = emailWhileOnChat;
    }

    public Integer getEnableDde4outgoing() {
        return enableDde4outgoing;
    }

    public void setEnableDde4outgoing(Integer enableDde4outgoing) {
        this.enableDde4outgoing = enableDde4outgoing;
    }

}
