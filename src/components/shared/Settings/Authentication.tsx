import Paragraph from "../Paragraph";
import Dashbutton from "../DashButton";

const Authentication = () => {
  const manage2FA = () => {};
  return (
    <div className="bg-white pt-[20px]">
      <div className="pb-[16px] pl-[20px]">
        <Paragraph text="Protect your account with two-step verification codes." />
        <div>
        <Paragraph text="Authentication App" />
        <p>Use Google Authenticator to protect your account.</p>
        </div>
        <div className="flex flex-row gap-[2px]">
          <Dashbutton
            name="Manage"
            type="filled"
            onClickHandler={manage2FA}
          />
        </div>
      </div>
    </div>
  );
};
export default Authentication;
