class Order {
  final String id;
  final String originalId;
  final String customer;
  final String date;
  final int items;
  final String total;
  final String status;

  Order({
    required this.id,
    required this.originalId,
    required this.customer,
    required this.date,
    required this.items,
    required this.total,
    required this.status,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      originalId: json['originalId'],
      customer: json['customer'],
      date: json['date'],
      items: json['items'],
      total: json['total'],
      status: json['status'],
    );
  }
}
