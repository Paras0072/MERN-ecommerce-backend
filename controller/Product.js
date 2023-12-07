const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  // this product we have to get API body
  const product = new Product(req.body);

  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch(err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // here we need all query string
  //filter: "category":[ " smartphone ","laptops"]
  // queryString = use after ? for sorting
  // todo : on server will support multiple values
  // sort ={sort:"price",_order:"desc"}
  // pagination = {page:1,_limit:10}_page=1&-limit=10
  let query = Product.find({});
  let totalProductQuery=Product.find({})
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductQuery = totalProductQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductQuery = totalProductQuery.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });

  }
   const totalDocs = await totalProductQuery.count().exec();
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
exports.fetchProductById = async (req, res) => {
 const{id} =req.params;
try {
  const product = await Product.findById(id);
    res.status(200).json(product);
  } catch(err) {
    res.status(400).json(err);
  }
}
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};