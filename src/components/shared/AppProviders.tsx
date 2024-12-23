import { ThemeProvider } from "next-themes";
import { FetchProvider } from "@/components/Providers";
import { StoreProvider } from "@/stores/StoreProvider";
import { TransactionProvider } from "@/context/TransactionContext";
import { SiinsProvider } from "@/context/SiinsContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <FetchProvider>
            <TransactionProvider>
                <SiinsProvider>
                    {children}
                </SiinsProvider>
            </TransactionProvider>
        </FetchProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
