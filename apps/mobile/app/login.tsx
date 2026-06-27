import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { colors, emblemGradients, fonts, radius, spacing, type } from "@/lib/theme";

type Step = "email" | "code";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { sendCode, verifyCode } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const codeInputRef = useRef<TextInput>(null);

  const cleanEmail = email.trim();

  // Always resolve to a real screen: router.back() is a no-op if /login was the
  // entry route (e.g. a swt://login cold-start deep link), which would strand
  // the user on the modal even after a successful sign-in.
  function dismiss() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  async function handleSendCode() {
    if (sending) return;
    setError(null);

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError("That doesn't look like a valid email address.");
      return;
    }

    setSending(true);
    try {
      const { error: sendError } = await sendCode(cleanEmail);
      if (sendError) {
        setError(sendError);
        return;
      }
      setCode("");
      setStep("code");
      // Focus the code field once we've advanced.
      setTimeout(() => codeInputRef.current?.focus(), 350);
    } catch {
      setError("We couldn't send your code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  // Jump straight to code entry without sending a new email — for when a code
  // was already received (slow email, rate limit, re-opened the flow).
  function goToCodeStep() {
    if (sending) return;
    setError(null);
    if (!cleanEmail) {
      setError("Enter your email first, then your code.");
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError("Enter a valid email, then your code.");
      return;
    }
    setCode("");
    setStep("code");
    setTimeout(() => codeInputRef.current?.focus(), 350);
  }

  async function handleResend() {
    if (resending || sending) return;
    setError(null);
    setResending(true);
    try {
      const { error: resendError } = await sendCode(cleanEmail);
      if (resendError) {
        setError(resendError);
      }
    } catch {
      setError("We couldn't resend your code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  async function handleVerify() {
    if (verifying) return;
    setError(null);

    if (code.length < 6) {
      setError("Enter the code from your email.");
      return;
    }

    setVerifying(true);
    try {
      const { error: verifyError } = await verifyCode(cleanEmail, code);
      if (verifyError) {
        setError(verifyError);
        return;
      }
      // Success: global auth state flips; dismiss the modal.
      dismiss();
    } catch {
      setError("We couldn't verify that code. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function backToEmail() {
    if (sending || verifying || resending) return;
    setError(null);
    setCode("");
    setStep("email");
  }

  const closeButton = (
    <Pressable
      onPress={dismiss}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Close"
      style={styles.closeBtn}
    >
      <Ionicons name="close" size={22} color={colors.wine} />
    </Pressable>
  );

  const subtitle =
    step === "email"
      ? "Sign in to start collecting stamps and unlock your Digital Passport."
      : "Almost there — just confirm the code we emailed you.";

  return (
    <Screen
      title="Sign in"
      overline="Scottsdale Wine Trail"
      subtitle={subtitle}
      right={closeButton}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <View style={styles.emblemWrap}>
          <LinearGradient
            colors={emblemGradients[0] ?? [colors.wine, colors.wineDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emblem}
          >
            <Ionicons
              name={step === "email" ? "mail-outline" : "shield-checkmark-outline"}
              size={28}
              color={colors.gold}
            />
          </LinearGradient>
        </View>

        {step === "email" ? (
          <View style={styles.card}>
            <Text style={type.overline}>Your email</Text>
            <Text style={styles.heading}>Welcome to the trail</Text>
            <Text style={styles.helper}>
              We'll email you a sign-in code. No passwords, ever.
            </Text>

            <View style={styles.fieldWrap}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.textSubtle}
                style={styles.fieldIcon}
              />
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError(null);
                }}
                placeholder="you@email.com"
                placeholderTextColor={colors.textSubtle}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                autoFocus
                editable={!sending}
                onSubmitEditing={handleSendCode}
                style={styles.input}
                accessibilityLabel="Email address"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.cta}>
              <Button
                label="Send code"
                icon="paper-plane-outline"
                loading={sending}
                onPress={handleSendCode}
              />
            </View>

            <View style={styles.altRow}>
              <Button
                label="I already have a code"
                variant="ghost"
                fullWidth={false}
                disabled={sending}
                onPress={goToCodeStep}
              />
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={type.overline}>Verify it's you</Text>
            <Text style={styles.heading}>Enter your code</Text>
            <Text style={styles.helper}>
              We sent a code to{"\n"}
              <Text style={styles.emailStrong}>{cleanEmail}</Text>
            </Text>

            <TextInput
              ref={codeInputRef}
              value={code}
              onChangeText={(t) => {
                setCode(t.replace(/[^0-9]/g, ""));
                if (error) setError(null);
              }}
              placeholder="••••••"
              placeholderTextColor={colors.textSubtle}
              keyboardType="number-pad"
              maxLength={10}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              editable={!verifying}
              onSubmitEditing={handleVerify}
              style={styles.codeInput}
              accessibilityLabel="Verification code"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.cta}>
              <Button
                label="Verify & sign in"
                icon="checkmark-circle-outline"
                loading={verifying}
                disabled={code.length < 6}
                onPress={handleVerify}
              />
            </View>

            <View style={styles.ghostRow}>
              <Button
                label="Resend code"
                variant="ghost"
                fullWidth={false}
                loading={resending}
                disabled={verifying}
                onPress={handleResend}
              />
              <Button
                label="Use a different email"
                variant="ghost"
                fullWidth={false}
                disabled={verifying || resending}
                onPress={backToEmail}
              />
            </View>
          </View>
        )}

        <Text style={styles.legal}>
          By continuing you agree to receive a one-time sign-in code at this address.
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.wineSoft,
  },
  emblemWrap: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  emblem: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing["2xl"],
    gap: spacing.xs,
  },
  heading: {
    ...type.h2,
    marginTop: spacing.xs,
  },
  helper: {
    ...type.bodyMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  emailStrong: {
    fontFamily: fonts.sansSemibold,
    color: colors.wine,
  },
  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.text,
  },
  codeInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingVertical: spacing.lg,
    fontFamily: fonts.sansSemibold,
    fontSize: 30,
    letterSpacing: 12,
    textAlign: "center",
    color: colors.text,
  },
  error: {
    ...type.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  cta: {
    marginTop: spacing.xl,
  },
  altRow: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
  ghostRow: {
    marginTop: spacing.sm,
    alignItems: "center",
    gap: spacing.xs,
  },
  legal: {
    ...type.caption,
    color: colors.textSubtle,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
