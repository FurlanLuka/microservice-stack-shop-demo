# Microservice stack demo project

### [https://docs.microservice-stack.com/introduction/](Microservice stack documentation)

### [https://docs.microservice-stack.com/introduction/demo-project/project-overview](Demo project documentation)



### How to use?

After you close, install the packages using NPM

```
npm i
```

After the packages are installed, you can set up the local cluster using microservice stack cli

```
npx @microservice-stack/local-deployment install
```

After the cluster is set up deploy ingress controller

```
npx @microservice-stack/local-deployment update-ingress
```

To expose the ingress controller you first have to find out the ingress controller pod name by executing the following command

```
kubectl -n ingress-nginx get pods
```

The response should look something like this

![](<../.gitbook/assets/image (6) (2).png>)

You can now take the ingress controller name and insert it into the `kubectl port-forward` command and expose it to your local address.

```
kubectl port-forward -n ingress-nginx ingress-nginx-controller-cc8496874-fdzsk 3000:80
```

This command will expose the local cluster to `http://localhost3000`.