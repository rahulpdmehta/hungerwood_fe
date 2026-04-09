/**
 * AnimationContainer - Main container for all animations
 * Import this once at the app root level
 */

import OrderPlacedAnimation from './OrderPlacedAnimation';
import WalletCreditAnimation from './WalletCreditAnimation';
import AddToCartAnimation from './AddToCartAnimation';
import OrderStatusAnimation from './OrderStatusAnimation';
import ReferralSuccessAnimation from './ReferralSuccessAnimation';
import GlobalOrderStatusListener from './GlobalOrderStatusListener';

const AnimationContainer = () => {
  return (
    <>
      <OrderPlacedAnimation />
      <WalletCreditAnimation />
      <AddToCartAnimation />
      <OrderStatusAnimation />
      <ReferralSuccessAnimation />
      <GlobalOrderStatusListener />
    </>
  );
};

export default AnimationContainer;
