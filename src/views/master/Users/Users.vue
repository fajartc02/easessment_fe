<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex row align-items-center">
                <div class="col-10">
                    Master Users
                </div>
                <div class="col">
                    <button class="btn btn-success" @click="this.$router.push('/master/user/form')">
                        Add User
                        <CIcon icon="cil-plus" size="sm" />
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body text-center">
            <div class="row">
                <div class="col">
                    <CInputGroup class="mb-3">
                        <CInputGroupText>Line</CInputGroupText>
                        <Select2 v-model="filtered.line_id" class="form-control" :options="getLinesOpts" />
                    </CInputGroup>
                </div>
                <div class="col">
                    <CInputGroup class="mb-3">
                        <CInputGroupText>Name</CInputGroupText>
                        <Select2 class="form-control" :options="noregUser" />
                    </CInputGroup>
                </div>
                <div class="col-2">
                    <button class="btn btn-primary" @click="getUsersStore()">Search</button>
                </div>
            </div>
            <table class="table table-bordered table-stripped">
                <tr>
                    <th>No</th>
                    <th>Noreg</th>
                    <th>Nama</th>
                    <th>Pembuat</th>
                    <th>Tanggal Di buat</th>
                    <th colspan="2">Actions</th>
                </tr>
                <template v-if="usersState.length > 0">
                    <tr v-for="(pos, i) in usersState" :key="pos.id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ pos.noreg }}</td>
                        <td>{{ pos.text }}</td>
                        <td>{{ pos.created_by }}</td>
                        <td>{{ pos.created_dt.split('T')[0] }}</td>
                        <td>
                            <CButton color="warning" @click="edit(pos.id)">
                                <CIcon icon="cil-pencil" size="sm" />
                            </CButton>
                        </td>
                        <td>
                            <CButton color="danger" @click="del(pos.id)">
                                <CIcon icon="cil-trash" size="sm" />
                            </CButton>
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="6">
                        <h3>Tidak Ada Data</h3>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { GET_LINES } from "@/store/modules/line.module";

import { GET_USERS, DELETE_USER } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
// import queryFormat from "@/functions/queryFormat";

export default {
    name: 'Users',
    data() {
        return {
            form: {
                line_id: null
            },
            usersState: [],
            filtered: {
                line_id: -1,
                limit: 5,
                totalPage: 1,
                currentPage: 1,
                // job_type_id: null
            },
        }
    },
    watch: {
        getUsers: function () {
            this.usersState = this.getUsers
        }
    },
    computed: {
        ...mapGetters(['getUsers', 'getLinesOpts']),
        noregUser() {
            if (this.getUsers) {
                let container = this.getUsers.map(user => {
                    return {
                        id: user.id,
                        text: `${user.noreg}-${user.text}`
                    }
                })
                return container;
            } else {
                return [];
            }
        }
    },
    methods: {
        async getUsersStore() {
            await this.$store.dispatch(GET_USERS, this.filtered)
        },
        async getLines() {
            this.$store.dispatch(GET_LINES)
        },
        async edit(id) {
            await this.$router.push(`/master/user/form?id=${id}`)
        },
        del(id) {
            Swal.fire({
                title: 'kamu mau menghapus data ini?',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                denyButtonText: `Tidak`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.$store.dispatch(DELETE_USER, id)
                        .then(async () => {
                            Swal.fire('Berhasil menghapus!', '', 'success')
                            await this.$store.dispatch(GET_USERS)
                        })
                        .catch(err => {
                            console.log(err);
                            Swal.fire('Gagal menghapus!', '', 'error')
                        })
                }
            })
        }
    },
    async mounted() {
        this.filtered.line_id = localStorage.getItem('line_id')
        await this.getUsersStore()
        await this.getLines()
    }
}
</script>
