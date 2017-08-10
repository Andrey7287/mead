const customerModel = require('../viewModels/customer.js');

exports = {
  registerRoutes: (app)=>{
    app.get('/customer/:id', this.home);
    app.get('/customer/:id/prefer', this.prefer);
    app.get('/orders/:id', this.orders);
    app.post('/customer/:id/update', this.orders);
  },
  home: (req, res, next)=>{
    Customer.findById(req.params.id, (err, customer)=>{
      if (err) return next(err);
      if( !customer ) return next(); //404
      customer.getOrders((err,orders)=>{
        if( err ) return next(err);
        res.render('customer/home', customerModel(customer, orders));
      });
    });
  },
  prefer: (req, res, next)=>{
    Customer.findById(req.params.id, (err, customer)=>{
      if (err) return next(err);
      if( !customer ) return next(); //404
      customer.getOrders((err,orders)=>{
        if( err ) return next(err);
        res.render('customer/prefer', customerModel(customer, orders));
      });
    });
  },
  orders: (req, res, next)=>{
    Customer.findById(req.params.id, (err, customer)=>{
      if (err) return next(err);
      if( !customer ) return next(); //404
      customer.getOrders((err,orders)=>{
        if( err ) return next(err);
        res.render('customer/prefer', customerModel(customer, orders));
      });
    });
  },
  ajaxUpdate: (req, res)=>{
    Customer.findById(req.params.id, (err, customer)=>{
      let fName = req.body.firstName.trim(); 
      if (err) return next(err);
      if( !customer ) return next(); //404
      if(fName){
        if ( !fName || typeof fName !== 'string' ) return res.json({error: 'Invalid name'});
        customer.firstName = fName;
      }
      customer.save((err)=>{
        return err ? res.json({error: 'Error updating'}) : res.json({success: true});
      });
    });
  }
}