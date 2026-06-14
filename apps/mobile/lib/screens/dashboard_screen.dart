import 'dart:convert';
import 'package:flutter/material.dart';
import '../api/api_client.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _metrics;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMetrics();
  }

  Future<void> _fetchMetrics() async {
    try {
      final response = await ApiClient.get('/dashboard');
      if (response.statusCode == 200) {
        setState(() {
          _metrics = jsonDecode(response.body);
          _isLoading = false;
        });
      }
    } catch (e) {
      print(e);
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    if (_metrics == null || _metrics!['metrics'] == null) {
      return Scaffold(appBar: AppBar(title: const Text('Dashboard')), body: const Center(child: Text('Failed to load metrics')));
    }

    final metricsList = _metrics!['metrics'] as List<dynamic>;

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildMetricCard(metricsList[0]['name'], metricsList[0]['value'], Icons.attach_money, Colors.green),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildMetricCard(metricsList[1]['name'], metricsList[1]['value'], Icons.shopping_cart, Colors.blue)),
                const SizedBox(width: 16),
                Expanded(child: _buildMetricCard(metricsList[2]['name'], metricsList[2]['value'], Icons.people, Colors.orange)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(color: Colors.grey, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
