import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalContainer from "../ModalContainer/ModalContainer";
import styles from "./registerModal.module.css";
import passwordIcon from "../../assets/passwordIcon.png";
import conf from "../../conf/conf";

const RegisterModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError(false);
    setIsProcessing(true);

    try {
      const response = await fetch(`${conf.backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setShowLogin(true);
      navigate("/?signin=true");

      toast.success("Registration successful! Please sign-in to continue");
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message);
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalContainer>
      <>
        <h1 className={styles.formHeader}>Register</h1>
        <form className={styles.formContainer}>
          <div>
            <label> Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              placeholder="Enter username"
              disabled={isProcessing}
            />
          </div>
          <div className={styles.passwordContainer}>
            <label>Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={styles.passwordInput}
              disabled={isProcessing}
            />
            <img
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordIcon}
              src={passwordIcon}
              alt="password icon"
            />
          </div>
          {showError && <div className={styles.error}>{errorMessage}</div>}
          <div>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={isProcessing ? styles.loadingButton : ""}
            >
              {isProcessing ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </>
    </ModalContainer>
  );
};

export default RegisterModal;
