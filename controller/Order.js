const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");
exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const orders = await Order.find({ user: id }).exec();

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  // this product we have to get API body
  const order = new Order(req.body);
  for (let item of order.items) {
    let product = await Product.findOne({ _id: item.product.id });
    product.$inc("stock", -1 * item.quantity);
    // for optimum performance we should make inventory outside of product.
    await product.save();
  }
  try {
    const doc = await order.save();
    const user = await User.findById(order.user)
    // we can use await for this also
    sendMail({to:user.email, html:invoiceTemplate(order), subject:'Order Received'})
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.deleteOrder = async (req, res) => {
  // this product we have to get API body
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchAllOrders = async (req, res) => {
  // here we need all query string
  //filter: "category":[ " smartphone ","laptops"]
  // queryString = use after ? for sorting
  // todo : on server will support multiple values
  // sort ={sort:"price",_order:"desc"}
  // pagination = {page:1,_limit:10}_page=1&-limit=10
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch {
    res.status(400).json(err);
  }
};
