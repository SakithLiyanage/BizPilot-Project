import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/inventory_provider.dart';
import '../models/product.dart';

class InventoryScreen extends StatefulWidget {
  @override
  _InventoryScreenState createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<InventoryProvider>(context, listen: false).fetchProducts();
    });
  }

  void _showAddProductDialog() {
    final nameCtrl = TextEditingController();
    final skuCtrl = TextEditingController();
    final catCtrl = TextEditingController();
    final costCtrl = TextEditingController();
    final sellCtrl = TextEditingController();
    final stockCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Theme.of(context).cardColor,
        title: const Text('Add Product', style: TextStyle(color: Colors.white)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Name')),
              const SizedBox(height: 8),
              TextField(controller: skuCtrl, decoration: const InputDecoration(labelText: 'SKU')),
              const SizedBox(height: 8),
              TextField(controller: catCtrl, decoration: const InputDecoration(labelText: 'Category')),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: costCtrl, decoration: const InputDecoration(labelText: 'Cost Price'), keyboardType: TextInputType.number)),
                  const SizedBox(width: 8),
                  Expanded(child: TextField(controller: sellCtrl, decoration: const InputDecoration(labelText: 'Selling Price'), keyboardType: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 8),
              TextField(controller: stockCtrl, decoration: const InputDecoration(labelText: 'Stock'), keyboardType: TextInputType.number),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final data = {
                'name': nameCtrl.text,
                'sku': skuCtrl.text,
                'category': catCtrl.text,
                'costPrice': double.tryParse(costCtrl.text) ?? 0.0,
                'sellingPrice': double.tryParse(sellCtrl.text) ?? 0.0,
                'stockQuantity': int.tryParse(stockCtrl.text) ?? 0,
              };
              final success = await Provider.of<InventoryProvider>(context, listen: false).addProduct(data);
              Navigator.pop(context);
              if (success) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Product Added')));
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inventory')),
      body: Consumer<InventoryProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (provider.products.isEmpty) {
            return const Center(child: Text('No products found.', style: TextStyle(color: Colors.grey)));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.products.length,
            itemBuilder: (context, index) {
              final p = provider.products[index];
              return Card(
                color: Theme.of(context).cardColor,
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: Colors.white10)),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  subtitle: Text('SKU: ${p.sku} | Stock: ${p.stockQuantity}', style: const TextStyle(color: Colors.grey)),
                  trailing: Text('\$${p.sellingPrice.toStringAsFixed(2)}', style: const TextStyle(color: Colors.greenAccent, fontSize: 16, fontWeight: FontWeight.bold)),
                  onLongPress: () {
                    showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        backgroundColor: Theme.of(context).cardColor,
                        title: const Text('Delete Product?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                          TextButton(
                            onPressed: () {
                              provider.deleteProduct(p.id);
                              Navigator.pop(context);
                            },
                            child: const Text('Delete', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        onPressed: _showAddProductDialog,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
