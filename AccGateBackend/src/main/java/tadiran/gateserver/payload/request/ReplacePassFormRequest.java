package tadiran.gateserver.payload.request;

import tadiran.gateserver.annotation.PasswordValueMatch;
import tadiran.gateserver.annotation.ValidPassword;
import lombok.*;
import tadiran.gateserver.models.ERole;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;



/**
 * <h2>ReplacePassFormRequest</h2>
 *
 * @author aek
 */
@PasswordValueMatch.List({
        @PasswordValueMatch(
                field = "password",
                fieldMatch = "confirmPassword",
                message = "Passwords do not match!"
        )
})
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReplacePassFormRequest {

    @NonNull
    @NotBlank(message = "Username is mandatory")
    private String username;

    @NotBlank(message = "Current Password is mandatory")
    private String oldPassword;

    @ValidPassword
    @NonNull
    @NotBlank(message = "New password is mandatory")
    private String password;


    @ValidPassword
    @NonNull
    @NotBlank(message = "Confirm Password is mandatory")
    private String confirmPassword;

}

