<template>
    <div class="container d-flex justify-content-center mt-5 mb-5">
        <div class="row g-3">
            <div class="col-md-6">
                <span>Metodo de pago</span>
                <div class="card">
                    <!-- <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-header p-0">
                                <h2 class="mb-0">
                                    <button class="btn btn-light btn-block text-left p-3 rounded-0"
                                        data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span>Credit card</span>
                                            <div class="icons">
                                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                                                <img src="https://i.imgur.com/W1vtnOV.png" width="30">
                                                <img src="https://i.imgur.com/35tC99g.png" width="30">
                                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                data-parent="#accordionExample">
                                <div class="card-body payment-card-body">
                                    <span class="font-weight-normal card-text">Card Number</span>
                                    <div class="input">
                                        <i class="fa fa-credit-card"></i>
                                        <input type="text" class="form-control" placeholder="0000 0000 0000 0000">
                                    </div>
                                    <div class="row mt-3 mb-3">
                                        <div class="col-md-6">
                                            <span class="font-weight-normal card-text">Expiry Date</span>
                                            <div class="input">
                                                <i class="fa fa-calendar"></i>
                                                <input type="text" class="form-control" placeholder="MM/YY">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <span class="font-weight-normal card-text">CVC/CVV</span>
                                            <div class="input">
                                                <i class="fa fa-lock"></i>
                                                <input type="text" class="form-control" placeholder="000">
                                            </div>
                                        </div>
                                    </div>
                                    <span class="text-muted certificate-text"><i class="fa fa-lock"></i>Su transacción está segura con certificado SSL</span>
                                </div>
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-header p-0">
                                <h2 class="mb-0">
                                    <button class="btn btn-light btn-block text-left p-3 rounded-0"
                                        data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span>Credit card</span>
                                            <div class="icons">
                                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                                                <img src="https://i.imgur.com/W1vtnOV.png" width="30">
                                                <img src="https://i.imgur.com/35tC99g.png" width="30">
                                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                            </div>

                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample">
                                <div class="card-body payment-card-body">
                                    <span class="font-weight-normal card-text">Número de tarjeta</span>
                                    <div class="input mb-1">
                                        <input type="text" class="form-control" placeholder="0000 0000 0000 0000"
                                            v-model="cardNumber">
                                    </div>
                                    <small class="text-danger">{{ errors.cardNumber }}</small>

                                    <div class="row mt-2 mb-2">
                                        <div class="col-md-6">
                                            <span class="font-weight-normal card-text">Expiración</span>
                                            <div class="input mb-1">
                                                <input type="text" class="form-control" placeholder="MM/YY"
                                                    v-model="expiryDate">
                                            </div>
                                            <small class="text-danger">{{ errors.expiryDate }}</small>
                                        </div>

                                        <div class="col-md-6">
                                            <span class="font-weight-normal card-text">CVC/CVV</span>
                                            <div class="input mb-1">
                                                <input type="text" class="form-control" placeholder="000" v-model="cvc">
                                            </div>
                                            <small class="text-danger">{{ errors.cvc }}</small>
                                        </div>
                                    </div>

                                    <span class="text-muted certificate-text"><i class="fa fa-lock"></i> Su transacción
                                        está segura con certificado SSL</span>

                                    <button @click="validateForm" class="btn btn-success btn-block mt-3 w-100">Confirmar
                                        compra</button>
                                </div>
                            </div>
                        </div>
                    </div> -->

                    <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-body payment-card-body">
                                <span class="font-weight-normal card-text">Número de tarjeta</span>
                                <div class="input mb-1">
                                    <input type="text" class="form-control" placeholder="0000 0000 0000 0000"
                                        :value="cardNumber" @input="formatCardNumber">
                                </div>
                                <small class="text-danger">{{ errors.cardNumber }}</small>

                                <div class="row mt-2 mb-2">
                                    <div class="col-md-6">
                                        <span class="font-weight-normal card-text">Expiración</span>
                                        <div class="input mb-1">
                                            <input type="text" class="form-control" placeholder="MM/YY"
                                                :value="expiryDate" @input="formatExpiryDate">
                                        </div>
                                        <small class="text-danger">{{ errors.expiryDate }}</small>
                                    </div>

                                    <div class="col-md-6">
                                        <span class="font-weight-normal card-text">CVC/CVV</span>
                                        <div class="input mb-1">
                                            <input type="text" class="form-control" placeholder="000" v-model="cvc"
                                                maxlength="4">
                                        </div>
                                        <small class="text-danger">{{ errors.cvc }}</small>
                                    </div>
                                </div>

                                <button @click="validateForm" class="btn btn-success btn-block mt-3 w-100">Confirmar
                                    compra</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <span>Resumen</span>
                <div class="card">
                    <div class="d-flex justify-content-between p-3">
                        <div class="d-flex flex-column">

                            <span>{{ selectedTemplate.nombre }} (Cobro automatico cada mes) <i
                                    class="fa fa-caret-down"></i></span>
                        </div>
                        <div class="mt-1">
                            <span class="super-price">Bs {{ selectedTemplate.monto }}</span>
                            <span class="super-month">/Mes</span>
                        </div>
                    </div>
                    <hr class="mt-0 line">
                    <div class="p-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Suscripción</span>
                            <span>Bs. {{ selectedTemplate.monto }}.00</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Impuestos <i class="fa fa-clock-o"></i></span>
                            <span>-0</span>
                        </div>
                    </div>
                    <hr class="mt-0 line">
                    <div class="p-3 d-flex justify-content-between">
                        <div class="d-flex flex-column">
                            <span>Pagaras(Bolivianos)</span>
                        </div>
                        <span>Bs. {{ selectedTemplate.monto }}.00</span>
                    </div>
                    <!-- <div class="p-3">
                        <button class="btn btn-primary btn-block free-button">Pagar</button>
                    </div> -->
                </div>
            </div>

        </div>


    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePlanStore } from '@/stores/plan'



const route = useRoute()
const router = useRouter()
const plan = usePlanStore()
const auth = useAuthStore()
const planId = route.query.plan || null

//card
const cardNumber = ref('')
const expiryDate = ref('')
const cvc = ref('')

const errors = ref({
    cardNumber: '',
    expiryDate: '',
    cvc: ''
})

const validateForm = async () => {
    errors.value = {
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    }

    let isValid = true

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate.value)) {
        errors.value.expiryDate = 'Formato inválido (MM/YY)'
        isValid = false
    }

    if (!/^\d{3,4}$/.test(cvc.value)) {
        errors.value.cvc = 'CVC inválido (3-4 dígitos)'
        isValid = false
    }

    if (isValid) {
        const res = await plan.update(auth.user.id, planId);

        if (res?.status === 200) {
            router.push({ name: 'dashboard' });
        } else {
            console.error('Error al actualizar el plan', res);
        }
        // plan.update(auth.user.id,planId)
        // router.push({ 
        //     name: 'dashboard', 
        // })
    }
}

const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.slice(0, 16)
    const formatted = value.match(/.{1,4}/g)?.join(' ') || ''
    cardNumber.value = formatted
}

const formatExpiryDate = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (value.length >= 3) {
        expiryDate.value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    } else {
        expiryDate.value = value
    }
}

const templates = {
    1: {
        nombre: 'Gratuito',
        monto: 0
    },
    2: {
        nombre: 'Básico',
        monto: 15
    },
    3: {
        nombre: 'Premium',
        monto: 30
    }
}

const selectedTemplate = computed(() => {
    return templates[planId] || { nombre: 'Premium', monto: '30' }
})

console.log(selectedTemplate.value);

</script>


<!-- 
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:weight@100;200;300;400;500;600;700;800&display=swap");


body {
    background-color: #f5eee7;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
}

.container {

    height: 100vh;

}

.card {

    border: none;
}

.card-header {
    padding: .5rem 1rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, .03);
    border-bottom: none;
}

.btn-light:focus {
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5;
    box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, .5);
}

.form-control {

    height: 50px;
    border: 2px solid #eee;
    border-radius: 6px;
    font-size: 14px;
}

.form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #039be5;
    outline: 0;
    box-shadow: none;

}

.input {

    position: relative;
}

.input i {

    position: absolute;
    top: 16px;
    left: 11px;
    color: #989898;
}

.input input {

    text-indent: 25px;
}

.card-text {

    font-size: 13px;
    margin-left: 6px;
}

.certificate-text {

    font-size: 12px;
}


.billing {
    font-size: 11px;
}

.super-price {

    top: 0px;
    font-size: 22px;
}

.super-month {

    font-size: 11px;
}


.line {
    color: #bfbdbd;
}

.free-button {

    background: #1565c0;
    height: 52px;
    font-size: 15px;
    border-radius: 8px;
}


.payment-card-body {

    flex: 1 1 auto;
    padding: 24px 1rem !important;

}
</style> -->