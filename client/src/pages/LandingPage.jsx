import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext.jsx';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { account, connectWallet } = useContext(WalletContext);

  const handleConnectWallet = async () => {
    const account = await connectWallet();
    if (account) {
      
      if (account.toLowerCase() === (isAdmin ? account.toLowerCase() : account.toLowerCase()) && isAdmin) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
    
  };

  const handleGoToHome = () => {
   
  };  

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  
  if(account){
    return (
      <h1>account connected</h1>
    )
  }
  return (
    
    <div className="landing-container">
      <div className="particles2"></div>
      
      <div className="landing-content">
        <h1 className="landing-title">
          <span className="title-text">Blockchain Voting</span>
          <span className="title-subtitle">Decentralized Democracy</span>
        </h1>
        
        <p className="landing-description">
          Secure, Transparent, and Immutable Voting on the Blockchain
        </p>

        {!account ? (
          <button className="connect-wallet-btn" onClick={handleConnectWallet}>
            <span className="btn-content">Connect Wallet</span>
            <span className="btn-glow"></span>
          </button>
        ) : (
          <div className="connected-section">
            <div className="wallet-address">
              <span className="address-label">Connected:</span>
              <span className="address-value">{shortenAddress(account)}</span>
            </div>
            <button className="home-btn" onClick={handleGoToHome}>
              <span className="btn-content">Go to Home</span>
              <span className="btn-glow"></span>
            </button>
          </div>
        )}

        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <span>Secure</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌐</div>
            <span>Decentralized</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Transparent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;