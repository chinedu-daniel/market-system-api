const customerRepository = require("../repositories/customer.respository");

exports.createCustomer = async(data) =>{
    const customer = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone
    };

    const createdCustomer = await customerRepository.createCustomer(customer);
}