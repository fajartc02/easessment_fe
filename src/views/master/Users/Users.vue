<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex row align-items-center">
                <div class="col-10">
                    Master Users
                </div>
                <div class="col">
                    <button class="btn btn-success" @click="this.$router.push('/master/pos/form')">
                        Add Pos<CIcon
                                    icon="cil-plus" 
                                    size="sm"
                                />
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body text-center">
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
                            <CButton color="warning" @click="editLine(pos.id)">
                                <CIcon
                                    icon="cil-pencil" 
                                    size="sm"
                                />
                            </CButton>
                        </td>
                        <td>
                            <CButton color="danger" @click="deleteLine(pos.id)">
                                <CIcon
                                    icon="cil-trash" 
                                    size="sm"
                                />
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
import { GET_USERS, DELETE_USER} from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
    name: 'Users',
    data() {
        return {
            form: {
                line_id: null
            },
            usersState: []
        }
    },
    watch: {
        getUsers: function() {
            console.log(this.getUsers);
            this.usersState = this.getUsers
        }
    },
    computed: {
        ...mapGetters(['getUsers'])
    },
    methods: {
        async getUsersStore() {
            await this.$store.dispatch(GET_USERS)
        },
        async editLine(id) {
            await this.$router.push(`/master/company/form?id=${id}`)
        },
        deleteLine(id) {
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
       await this.getUsersStore()
    }
}
</script>