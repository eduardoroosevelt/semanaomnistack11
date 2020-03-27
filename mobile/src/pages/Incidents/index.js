import React, {useState, useEffect} from 'react';
import {View, FlatList,Image, Text, TouchableOpacity} from 'react-native';
import {Feather} from '@expo/vector-icons';
import  logoImg from '../../assets/logo.png';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import api from '../../services/api'


export default function Incidents(){

    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] =useState(0);
    const [page, setpage] =useState(1);
    const [loading, setloading] =useState(false);
    
    function navigateToDetail(incident){
        navigation.navigate('Detail',{incident});
    }

    async function loadIncidents(){
        if (loading){
            return;
        }

        if(total > 0 && incidents.length === total){
            return;
        }

        setloading(true);

        const response = await api.get('incidents',{
            params:{page}
        });
        
        setIncidents([... incidents, ... response.data]);
        setTotal(response.headers['x-total-count']);
        setpage(page + 1);
        setloading(false);
    }

    useEffect( ()=>{
        loadIncidents();
        
    },[] )

    return(
        <View style={styles.container}> 
            <View style={styles.header}>
                <Image source={logoImg}/>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text> .
                </Text>
            </View>

            <Text style={styles.title}> Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia. </Text>
            
            <FlatList 
                style={styles.incidentsList}
                data={incidents}
                showsVerticalScrollIndicator ={false}
                keyExtractor={incidents =>String(incidents.id)}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item:incident })=>(

                    <View style={styles.incidents}>
                        <Text style={styles.incidentsProperty}>ONG: </Text>
                        <Text style={styles.incidentsValue}>{incident.name} </Text>
                        
                        <Text style={styles.incidentsProperty}>CASO: </Text>
                        <Text style={styles.incidentsValue}>{incident.title} </Text>
                        
                        <Text style={styles.incidentsProperty}>VALOR: </Text>
                        <Text style={styles.incidentsValue}>
                                {Intl.NumberFormat('pt-BR',{
                                        style:'currency',
                                        currency:'BRL'
                                        }).format(incident.value)} </Text>

                        <TouchableOpacity 
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                            >
                            <Text style={styles.detailButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041"/>
                        </TouchableOpacity>
                    </View>

                ) }
            />
            
        </View> 
    );
}

