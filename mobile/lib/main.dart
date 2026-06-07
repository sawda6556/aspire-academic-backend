import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/tutor_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/messaging_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TutorProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
        ChangeNotifierProvider(create: (_) => MessagingProvider()),
      ],
      child: const AspireApp(),
    ),
  );
}

class AspireApp extends StatelessWidget {
  const AspireApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aspire Academic Co.',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF2B4C7E),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2B4C7E),
          primary: const Color(0xFF2B4C7E),
          secondary: const Color(0xFFC9A962),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto', // Fallback font
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/home': (context) => const HomeScreen(),
      },
    );
  }
}
