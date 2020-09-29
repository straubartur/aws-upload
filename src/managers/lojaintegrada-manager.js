
function createByLojaIntegradaPedido(pedido) {
    // TODO
    return Promise.resolve({
        id: uuid.v4(),
        pedido
    });
}

async function updatePurchaseByLojaIntegrada(loja_integrada_pedido_id) {
    try {
        const pedido = await lojaIntegrada.getPedidoDetail(loja_integrada_pedido_id);
        let purchase = await purchasesRepository.find({ loja_integrada_pedido_id });
        let customer = await customersService.find({ loja_integrada_cliente_id: pedido.cliente.id });
        let custom_info;

        if (purchase) {
            custom_info = {
                aws_logo_path: purchase.aws_logo_path,
                custom_name: purchase.custom_name,
                custom_phone: purchase.custom_phone,
                rank: purchase.rank,
            }
        }

        if (!customer) {
            customer = await customersService.createByLojaIntegradaCliente(pedido.cliente, custom_info);
        }

        if (!purchase) {
            purchase = await createByLojaIntegradaPedido(pedido, customer);
        } else {
            customersService.updateLojaIntegradaInfo(customer.id, {
                name: pedido.nome,
                cellphone: pedido.telefone_celular,
                phone: pedido.telefone_principal,
            }, custom_info);

            purchasesRepository.updateById(purchase.id, { customer_id: customer.id });
        }

        // TODO: If package is published
        // Customizer.PurchaseById(purchase);
    } catch (error) {
        console.error('Não foi possível atualizar o cliente do Pedido!');
        console.error(error);
        throw error;
    }
}

module.exports = {
    updatePurchaseByLojaIntegrada
}
