import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const BizPilotApp());
}

class BizPilotApp extends StatelessWidget {
  const BizPilotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BizPilot AI',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String _error = '';

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      // Note: use 10.0.2.2 instead of localhost for Android emulator
      final response = await http.post(
        Uri.parse('http://10.0.2.2:4000/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text,
          'password': _passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => DashboardScreen(token: data['token'])),
        );
      } else {
        setState(() {
          _error = 'Invalid credentials';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Network error. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.rocket_launch, size: 64, color: Colors.blue),
              const SizedBox(height: 16),
              const Text('BizPilot AI', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const Text('Business OS in your pocket', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 32),
              if (_error.isNotEmpty) ...[
                Text(_error, style: const TextStyle(color: Colors.red)),
                const SizedBox(height: 16),
              ],
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
                obscureText: true,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _login,
                  child: _isLoading ? const CircularProgressIndicator() : const Text('Sign In'),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  final String token;
  const DashboardScreen({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const LoginScreen()));
            },
          )
        ],
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        children: [
          _buildCard(Icons.inventory, 'Inventory', '12 Items', Colors.orange),
          _buildCard(Icons.shopping_cart, 'Orders', '3 New', Colors.green),
          _buildCard(Icons.people, 'Customers', '45 Total', Colors.blue),
          _buildCard(Icons.analytics, 'Analytics', 'Rs 120k', Colors.purple),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Voice Command feature stub
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Listening for AI command...')));
        },
        child: const Icon(Icons.mic),
      ),
    );
  }

  Widget _buildCard(IconData icon, String title, String subtitle, Color color) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text(subtitle, style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
